<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'SL Vehicle Rental ERP' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
    <?php if (isset($_SESSION['user'])): ?>
        <?php include 'partials/header.php'; ?>
        <div class="container-fluid">
            <div class="row">
                <?php include 'partials/sidebar.php'; ?>
                <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                    <?php include $content; ?>
                </main>
            </div>
        </div>
    <?php else: ?>
        <?php include $content; ?>
    <?php endif; ?>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="/assets/js/main.js"></script>
</body>
</html>
