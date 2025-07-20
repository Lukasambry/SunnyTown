<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Thread extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'forum_category_id',
        'user_id',
    ];

    public function category()
    {
        return $this->belongsTo(ForumCategory::class, 'forum_category_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function forumCategory()
    {
        return $this->belongsTo(ForumCategory::class);
    }

    public function getRouteKeyName()
    {
        return 'id';
    }
}
