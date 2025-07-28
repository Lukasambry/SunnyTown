<?php

namespace App\Policies;

use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BlogPostPolicy
{
    public function create(User $user)
    {
        return $user->is_admin
            ? Response::allow()
            : Response::deny('Seuls les administrateurs peuvent créer des articles.');
    }
}
