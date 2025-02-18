<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
   public function index()
   {
      // Fetch all pending tasks with sub-tasks
      $pendingTasks = Task::with('subTasks')->where('status', 'pending')->get();

      return Inertia::render('Dashboard', [
         'pendingTasks' => $pendingTasks,
      ]);
   }
}

