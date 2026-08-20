<?php

use App\Http\Controllers\Admin\AttributeController as AdminAttributeController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CmsController;
use App\Http\Controllers\Admin\CollectionController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\CouponController as ShopCouponController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

// Storefront Public Routes
Route::get('/', [ShopController::class, 'home'])->name('home');
Route::get('/shop', [ShopController::class, 'catalog'])->name('shop.index');
Route::get('/about-us', [ShopController::class, 'about'])->name('about');
Route::get('/contact-us', [ShopController::class, 'contact'])->name('contact');
Route::get('/faq', [ShopController::class, 'faq'])->name('faq');
Route::get('/terms-of-use', [ShopController::class, 'termsOfUse'])->name('terms');
Route::get('/privacy-policy', [ShopController::class, 'privacyPolicy'])->name('privacy');
Route::get('/product/{slug}', [ShopController::class, 'productDetail'])->name('shop.product');
Route::get('/cart', [ShopController::class, 'cart'])->name('shop.cart');
Route::get('/checkout', [CheckoutController::class, 'showCheckout'])->name('shop.checkout');
Route::post('/checkout/apply-coupon', [ShopCouponController::class, 'apply'])->name('shop.coupon.apply');
Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('shop.checkout.process');
Route::post('/payment/razorpay/verify', [CheckoutController::class, 'verifyRazorpay'])->name('shop.razorpay.verify');
Route::get('/order-success/{order_number}', [CheckoutController::class, 'orderSuccess'])->name('shop.orderSuccess');
Route::get('/wishlist', [ShopController::class, 'wishlist'])->name('shop.wishlist');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth')->name('logout');

// Admin Panel Routes (Protected by Auth)
Route::prefix('admin')->name('admin.')->middleware('auth')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Products CRUD
    Route::post('products/upload-media', [AdminProductController::class, 'uploadMedia'])->name('products.upload-media');
    Route::patch('products/{product}/toggle-featured', [AdminProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
    Route::resource('products', AdminProductController::class);

    // Coupons CRUD
    Route::patch('coupons/{coupon}/toggle-active', [AdminCouponController::class, 'toggleActive'])->name('coupons.toggle-active');
    Route::resource('coupons', AdminCouponController::class);

    // Collections
    Route::resource('collections', CollectionController::class)->except(['create', 'edit', 'show']);

    // Categories
    Route::resource('categories', AdminCategoryController::class)->except(['create', 'edit', 'show']);

    // Attributes & Variation Terms
    Route::resource('attributes', AdminAttributeController::class)->except(['create', 'edit', 'show']);
    Route::post('attributes/{attribute}/values', [AdminAttributeController::class, 'storeValue'])->name('attributes.values.store');
    Route::delete('attribute-values/{value}', [AdminAttributeController::class, 'destroyValue'])->name('attributes.values.destroy');

    // Orders
    Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus'])->name('orders.status');

    // Customers
    Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');

    // Settings
    Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

    // Homepage CMS & Website Customizer
    Route::get('/cms', [CmsController::class, 'index'])->name('cms.index');
    Route::post('/cms/slider', [CmsController::class, 'updateSlider'])->name('cms.slider');
    Route::post('/cms/seasonal-collection', [CmsController::class, 'updateSeasonalCollection'])->name('cms.seasonal');
    Route::post('/cms/promo-banners', [CmsController::class, 'updatePromoBanners'])->name('cms.banners');
});
