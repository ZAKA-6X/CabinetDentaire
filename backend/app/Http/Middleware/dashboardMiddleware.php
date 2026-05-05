<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class dashboardMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (session('role') === 'patient') {
            return redirect('dashboard_Patient');
        }else if (session('role') === 'dentiste') {
            return redirect('dashboard_Dentiste');
        }else if (session('role') === 'secretaire') {
            return redirect('dashboard_Secretaire');
        }
    }
}
