<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'due_date',
        'estimated_time',
        'priority',
        'tag',
        'description',
        'sub_task',
        'status',
    ];

    protected $casts = [
        'sub_task' => 'array', // Cast JSON column to an array
    ];
    public function subTasks()
    {
        return $this->hasMany(SubTask::class);
    }
}
