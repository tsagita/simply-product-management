<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'fetch']);
Route::post('/products', [ProductController::class, 'add']);
Route::put('/products/{id}', [ProductController::class, 'update']);
