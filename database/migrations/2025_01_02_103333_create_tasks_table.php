<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Assuming users table exists
            $table->string('title');
            $table->date('due_date')->nullable();
            $table->string('estimated_time')->default('0h0m');
            $table->enum('priority', ['High', 'Medium', 'Low', 'Normal'])->default('Normal');
            $table->string('tag')->nullable();
            $table->text('description')->nullable();
            $table->json('sub_task')->nullable(); // Checklist items stored as JSON
            $table->enum('status', ['pending', 'InProgress', 'review', 'completed'])->default('pending');
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Drop the foreign key constraint first
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        // Then drop the tasks table
        Schema::dropIfExists('tasks');
    }
};
