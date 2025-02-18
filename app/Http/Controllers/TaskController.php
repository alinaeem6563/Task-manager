<?php

namespace App\Http\Controllers;

use App\Models\SubTask;
use App\Models\Task;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with('subTasks')->get()->groupBy('status');

        return Inertia::render('Task/GridView', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return inertia('Task/Task');
    }

    /**
     * Store a newly created resource in storage.
     */


    public function store(Request $request)
    {
        try {
            // Validation rules
            $validatedData = $request->validate(
                [
                    'user_id' => 'required|exists:users,id',
                    'title' => 'required|string|max:255',
                    'due_date' => 'required|date|after_or_equal:today',
                    'estimated_time' => ['required', 'string', 'regex:/^(\d+h\d+m|\d+h|\d+m)$/'],
                    'priority' => 'required|in:High,Medium,Low,Normal',
                    'tag' => 'nullable|string|max:255',
                    'description' => 'nullable|string',
                    'status' => 'required|in:pending,InProgress,completed',
                    'sub_task' => 'nullable|array',
                    'sub_task.*' => 'required|string|max:255',
                ],
                [
                    'due_date.after_or_equal' => 'The due date cannot be in the past.',
                    'sub_task.' => 'Each sub-task must have a name.',
                    'estimated_time.regex' => 'The estimated time must be in the format like 1h30m, 2h, or 45m.',
                ]
            );


            DB::beginTransaction();

            // Create the main task
            $task = Task::create($validatedData);

            // Handle sub-tasks if provided
            if (!empty($validatedData['sub_task'])) {
                foreach ($validatedData['sub_task'] as $subTaskTitle) {
                    SubTask::create([
                        'task_id' => $task->id,
                        'title' => $subTaskTitle,
                    ]);
                }
            }

            DB::commit();

            return back()->with('success', 'Task successfully created');
        } catch (\Exception $e) {
            // In case of an error, redirect back with an error message
            return back()->with('error', 'Failed to create task: ' . $e->getMessage());
        }
    }



    public function listView()
    {
        $tasks = Task::with('subTasks')->get()->groupBy('status');

        return Inertia::render('Task/ListView', [
            'tasks' => $tasks
        ]);
    }

    public function dashboard()
    {
        $tasks = Task::with('subTasks')->get();
        $totalTasks = $tasks->count();
        $completedTasks = $tasks->where('status', 'completed')->count();

        return Inertia::render('Dashboard/Dashboard', [
            'tasks' => $tasks,
            'totalTasks' => $totalTasks,
            'completedTasks' => $completedTasks,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            // Fetch the task with its sub-tasks
            $task = Task::with('subTasks')->findOrFail($id);

            return Inertia::render('Task/TaskDetails', [
                'task' => $task
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Return a 404 page with an error message
            return Inertia::render('Errors/404', [
                'message' => 'Task not found.'
            ])->setStatusCode(404);
        } catch (\Exception $e) {
            // Return a general error page
            return Inertia::render('Errors/500', [
                'message' => 'Something went wrong.'
            ])->setStatusCode(500);
        }
    }


    public function edit($id) {}

    public function update(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);

            $validatedData = $request->validate([
                'user_id' => 'sometimes|exists:users,id',
                'title' => 'sometimes|string|max:255',
                'due_date' => 'sometimes|date|after_or_equal:today',
                'estimated_time' => ['sometimes', 'string', 'regex:/^(\d+h\d+m|\d+h|\d+m)$/'],
                'priority' => 'sometimes|in:High,Medium,Low,Normal',
                'tag' => 'sometimes|nullable|string|max:255',
                'description' => 'sometimes|nullable|string',
                'status' => 'sometimes|required|in:pending,InProgress,review,completed',
                'sub_task' => 'sometimes|nullable|array',
                'sub_task.*' => 'sometimes|required|string|max:255',
            ]);

            DB::beginTransaction();
            $task->update($validatedData);

            // Handle sub-tasks if provided
            if ($request->has('sub_task')) {
                SubTask::where('task_id', $task->id)->delete();
                foreach ($validatedData['sub_task'] as $subTaskTitle) {
                    SubTask::create([
                        'task_id' => $task->id,
                        'title' => $subTaskTitle,
                    ]);
                }
            }

            DB::commit();
            return back()->with('success', 'Task successfully created');
        } catch (\Exception $e) {
            // In case of an error, redirect back with an error message
            return back()->with('error', 'Failed to create task: ' . $e->getMessage());
        }
    }





    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $task = Task::findOrFail($id);
            $task->delete();

            return Redirect::route('task.index')->with('success', 'Task successfully deleted');
        } catch (ModelNotFoundException $e) {
            return Redirect::back()->with('error', 'Task not found.');
        } catch (\Exception $e) {
            return Redirect::back()->with('error', 'Failed to delete task: ' . $e->getMessage());
        }
    }
    public function deleteByStatus($status)
    {
        try {
            // Ensure that the status is valid
            $validStatuses = ['pending', 'InProgress', 'review', 'completed'];
            if (!in_array($status, $validStatuses)) {
                // Redirect with an error message if the status is invalid
                return redirect()->back()->with('error', 'Invalid status.');
            }

            // Attempt to delete tasks with the given status
            $deletedCount = Task::where('status', $status)->delete();

            // Check if any tasks were deleted
            if ($deletedCount > 0) {
                // Redirect with a success message
                return redirect()->back()->with('success', 'Tasks deleted successfully.');
            } else {
                // Redirect with an error message if no tasks were found
                return redirect()->back()->with('error', 'No tasks found with this status.');
            }
        } catch (\Exception $e) {
            // Return an error message if the deletion fails
            return redirect()->back()->with('error', 'Failed to delete tasks.');
        }
    }
}
