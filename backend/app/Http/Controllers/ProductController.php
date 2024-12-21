<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProductController extends Controller
{
    public static $targetUrl = 'https://api.restful-api.dev/objects';
    public function fetch()
    {
        $response = Http::get(self::$targetUrl);
        $data = $response->json();

        $formattedData = array_map(function ($item) {
            return [
                'id' => $item['id'],
                'name' => $item['name'] ?? null,
                'price' => $item['data']['price'] ?? '-',
                'color' => $item['data']['color'] ?? '-',
            ];
        }, $data);

        return response()->json($formattedData);
    }

    public function add(Request $request)
    {
        $payload = [
            'name' => $request->input('name'),
            'data' => [
                'color' => $request->input('color'),
                'price' => $request->input('price'),
            ]
        ];

        $response = Http::post(self::$targetUrl, $payload);
        return $response->json();
    }

    public function update(Request $request, $id)
    {
        $url = implode('/', [
            self::$targetUrl,
            $id
        ]);
        $payload = [
            'name' => $request->input('name'),
            'data' => [
                'color' => $request->input('color'),
                'price' => $request->input('price'),
            ]
        ];

        $response = Http::put($url, $payload);
        return $response->json();
    }
}