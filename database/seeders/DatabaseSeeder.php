<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ForumCategorySeeder::class,
            ThreadSeeder::class,
            MessageSeeder::class,
            BlogPostSeeder::class,
            MessageImageSeeder::class,
            RoleSeeder::class
        ]);
        $this->call(ForumCategorySeeder::class);
    }
}
