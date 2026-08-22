<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show Admin Profile Edit Screen.
     */
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Admin/Profile/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'created_at' => $user->created_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Update Admin Profile Credentials.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:25',
            'current_password' => 'nullable|required_with:new_password|string',
            'new_password' => ['nullable', 'confirmed', Password::defaults()],
        ]);

        if (! empty($validated['new_password'])) {
            if (! Hash::check($validated['current_password'], $user->password)) {
                return back()->withErrors(['current_password' => 'The provided current password does not match.']);
            }

            $user->password = Hash::make($validated['new_password']);
        }

        $user->name = $validated['name'];
        $user->email = strtolower(trim($validated['email']));
        $user->phone = $validated['phone'] ?? null;
        $user->save();

        return back()->with('success', 'Admin profile and credentials updated successfully.');
    }
}
