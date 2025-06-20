<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'content',
    ];

    /**
     * Le user qui a posté le message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * La catégorie du message.
     */
    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    /**
     * Les images attachées au message.
     */
    public function images()
    {
        return $this->hasMany(MessageImage::class);
    }

    /**
     * Scope pour trier du plus récent au plus ancien.
     */
    public function scopeLatestFirst($query)
    {
        return $query->orderBy('created_at', 'desc');
    }
}
