<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Création des rôles
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // Création de l'admin
        $admin = User::create([
            'name' => 'Admin de SunnyTown',
            'email' => 'admin@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Création des autres utilisateurs
        $users = [
            ['name' => 'Pierre Bûcheron', 'email' => 'pierre.bucheron@sunnytown.com'],
            ['name' => 'Marie Fermière', 'email' => 'marie.fermiere@sunnytown.com'],
            ['name' => 'Lucas Mineur', 'email' => 'lucas.mineur@sunnytown.com'],
            ['name' => 'Sophie Architecte', 'email' => 'sophie.architecte@sunnytown.com'],
            ['name' => 'Thomas Marchand', 'email' => 'thomas.marchand@sunnytown.com'],
            ['name' => 'Emma Écologiste', 'email' => 'emma.ecologiste@sunnytown.com'],
            ['name' => 'Max Industriel', 'email' => 'max.industriel@sunnytown.com'],
            ['name' => 'Clara Décoratrice', 'email' => 'clara.decoratrice@sunnytown.com'],
        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
            $user->assignRole('user');
        }

        // Utilisateurs générés par la factory
        User::factory(15)->create()->each(function ($user) {
            $user->assignRole('user');
        });
    }
}
