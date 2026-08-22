<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login', [
            'products' => Product::take(6)->get(),
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            /** @var User $user */
            $user = Auth::user();

            // Link any past guest orders matching this user's email
            Order::where('customer_email', $user->email)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);

            if ($user->isAdmin()) {
                return redirect()->intended(route('admin.dashboard'));
            }

            return redirect()->intended(route('account.index'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register', [
            'products' => Product::take(6)->get(),
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:25',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower(trim($validated['email'])),
            'phone' => $validated['phone'] ?? null,
            'role' => 'customer',
            'password' => Hash::make($validated['password']),
        ]);

        // Automatically link all previous guest orders placed with this email
        $linkedOrdersCount = Order::where('customer_email', $user->email)
            ->whereNull('user_id')
            ->update(['user_id' => $user->id]);

        Auth::login($user);

        $welcomeMessage = $linkedOrdersCount > 0
            ? "Welcome to Haarmonaa! We found and linked {$linkedOrdersCount} order(s) previously placed with {$user->email}."
            : 'Welcome to Haarmonaa! Your account has been created successfully.';

        return redirect()->route('account.index')->with('success', $welcomeMessage);
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
