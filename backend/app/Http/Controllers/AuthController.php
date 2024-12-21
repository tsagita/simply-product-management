<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public static $email = "admin@example.com";
    public static $password = "admin123";

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $emailValid = $credentials['email'] === self::$email;
        $passwordValid = $credentials['password'] === self::$password;

        if ($emailValid && $passwordValid) {
            return response()->json([
                'message' => 'Login successful',
                'token' => 'dummy-token'
            ], 200);
        }
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}