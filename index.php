<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minihome</title>
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#6d1b38">
    <link rel="apple-touch-icon" href="assets/icon-192.png">
    <link rel="icon" type="image/jpeg" href="assets/favicon.jpg">
    <!-- Google Material Symbols & Fonts -->
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <?php
    $v = 14;
    ?>
    <!-- Main Styles -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?= $v ?>">
</head>

<body class="theme-dark"> <!-- Default theme class -->

    <header class="app-header">
        <div class="logo">
            <span class="material-icons-round">home</span>
            <h1>Minihome</h1>
        </div>
        <button id="settings-btn" class="icon-btn" aria-label="Configurações">
            <span class="material-icons-round">settings</span>
        </button>
    </header>

    <main class="dashboard-grid">
        <!-- Widgets -->
        <?php include 'widgets/clock.php'; ?>
        <?php include 'widgets/weather.php'; ?>
        <?php include 'widgets/calendar.php'; ?>
        <?php include 'widgets/timer.php'; ?>
        <?php include 'widgets/stopwatch.php'; ?>
        <?php include 'widgets/todo.php'; ?>
        <?php include 'widgets/notes.php'; ?>
        <?php include 'widgets/search.php'; ?>
        <?php include 'widgets/shortener.php'; ?>
    </main>

    <?php include 'widgets/settings_modal.php'; ?>

    <footer class="app-footer">
        2026 - <a href="https://laralabs.dev" target="_blank">Laralabs</a>
    </footer>

    <!-- Main JS -->
    <script src="assets/js/app.js?v=<?= $v ?>"></script>
    <script src="assets/js/settings.js?v=<?= $v ?>"></script>
    <!-- Widgets JS -->
    <script src="assets/js/widgets/clock.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/weather.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/calendar.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/timer.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/stopwatch.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/todo.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/notes.js?v=<?= $v ?>"></script>
    <script src="assets/js/widgets/search.js?v=<?= $v ?>"></script>

    <script src="assets/js/widgets/shortener.js?v=<?= $v ?>"></script>
</body>

</html>