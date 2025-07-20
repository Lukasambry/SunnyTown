<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Florian de SunnyTown',
            'email' => 'admin@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Pierre Bûcheron',
            'email' => 'pierre.bucheron@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Marie Fermière',
            'email' => 'marie.fermiere@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Lucas Mineur',
            'email' => 'lucas.mineur@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Sophie Architecte',
            'email' => 'sophie.architecte@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Thomas Marchand',
            'email' => 'thomas.marchand@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Emma Écologiste',
            'email' => 'emma.ecologiste@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Max Industriel',
            'email' => 'max.industriel@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Clara Décoratrice',
            'email' => 'clara.decoratrice@sunnytown.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        User::factory(15)->create();
    }
}
