<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\User;
use Filament\Resources\Pages\CreateRecord;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function handleRecordCreation(array $data): User
    {
        $role = $data['role'] ?? null;
        unset($data['role']);

        /** @var \App\Models\User $user */
        $user = static::getModel()::create($data);

        if ($role) {
            $user->syncRoles([$role]);
        }

        return $user;
    }
}
