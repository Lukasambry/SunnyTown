<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MessageImage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'message_id',
        'path',
    ];

    /**
     * Le message parent.
     */
    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
