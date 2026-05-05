<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::where('utilisateur_id', session('user'))
            ->orderByDesc('created_at')
            ->get();

        return response()->json($notifications);
    }

    public function markRead($id)
    {
        $notification = Notification::where('utilisateur_id', session('user'))
            ->findOrFail($id);

        $notification->update([
            'lu'    => true,
            'lu_le' => now(),
        ]);

        return response()->json($notification);
    }

    public function markAllRead()
    {
        Notification::where('utilisateur_id', session('user'))
            ->where('lu', false)
            ->update([
                'lu'    => true,
                'lu_le' => now(),
            ]);

        return response()->json(['message' => 'Toutes les notifications marquées comme lues.']);
    }
}
