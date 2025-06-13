<nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="position-sticky pt-3">
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link <?= $_SERVER['REQUEST_URI'] === '/dashboard' ? 'active' : '' ?>" href="/dashboard">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/vehicles') === 0 ? 'active' : '' ?>" href="/dashboard/vehicles">
                    <i class="bi bi-car-front"></i> Vehicles
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/bookings') === 0 ? 'active' : '' ?>" href="/dashboard/bookings">
                    <i class="bi bi-calendar-check"></i> Bookings
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/customers') === 0 ? 'active' : '' ?>" href="/dashboard/customers">
                    <i class="bi bi-people"></i> Customers
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/payments') === 0 ? 'active' : '' ?>" href="/dashboard/payments">
                    <i class="bi bi-credit-card"></i> Payments
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/reports') === 0 ? 'active' : '' ?>" href="/dashboard/reports">
                    <i class="bi bi-file-earmark-bar-graph"></i> Reports
                </a>
            </li>
        </ul>

        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Advanced</span>
        </h6>
        <ul class="nav flex-column mb-2">
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/maintenance') === 0 ? 'active' : '' ?>" href="/dashboard/maintenance">
                    <i class="bi bi-tools"></i> Maintenance
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/tracking') === 0 ? 'active' : '' ?>" href="/dashboard/tracking">
                    <i class="bi bi-geo-alt"></i> Tracking
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/dashboard/settings') === 0 ? 'active' : '' ?>" href="/dashboard/settings">
                    <i class="bi bi-gear"></i> Settings
                </a>
            </li>
        </ul>
    </div>
</nav>
