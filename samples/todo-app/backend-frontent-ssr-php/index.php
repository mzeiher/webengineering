<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>TodoApp</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <style>
        html, body {
            font-family: Helvetica, sans-serif;
        }

        body {
            margin: 0 auto;
            max-width: 400px;
        }

        .todo_list {
            list-style-type: none;
            padding: 0;
        }

        .todo_list li.done label {
            text-decoration: line-through;
        }

        .error {
            background-color: red;
            font-weight: bold;
            color: white;
        }

        main.offline {
            pointer-events: none;
            opacity: 0.5;
        }

        .todo_input,
        .todo_list li {
            display: grid;
            grid-template-columns: 1fr 2em;
        }


        .todo_input label,
        .todo_list input {
            grid-column: 1 span 1;
        }

        .todo_input button,
        .todo_list button {
            grid-column: 2 span 1;
        }
    </style>
</head>
<body>
    
<?php
$db = new SQLite3('todo.sqlite', SQLITE3_OPEN_CREATE | SQLITE3_OPEN_READWRITE);

// Create a table if not exists
$db->query(
'CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    todo TEXT NOT NULL,
    isDone BOOLEAN NOT NULL
)'
);

?>

<?php
// $_SERVER['REQUEST_METHOD']
if($_GET['action'] == 'add') {
    $todo = $_POST['text'];

    $stmt = $db->prepare('INSERT INTO todos (todo, isDone) VALUES (:text, false)');
    $stmt->bindValue(':text', $todo, SQLITE3_TEXT);
    $stmt->execute();
} elseif ($_GET['action'] == 'delete') {
    $id = $_GET['id'];

    $stmt = $db->prepare('DELETE FROM todos WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->execute();
} elseif ($_GET['action'] == 'update') {
    $id = $_GET['id'];

    $stmt = $db->prepare('UPDATE todos SET isDone = true WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $stmt->execute();
}
?>

<header><h1>ToDo App</h1></header>
<main class="">
    <ul class="todo_list">
        <?php
        $results = $db->query('SELECT * FROM todos ORDER BY id ASC, isDone ASC');
        while ($row = $results->fetchArray()) {
            $str = "<li class=\"" . ($row['isDone'] == true ? 'done' : '') . "\">";
            $str = $str . "<label>" . $row['todo'] . "</label>";
            if ($row['isDone'] == false) {
                $str = $str . "<form method=\"POST\" action=\"/?action=update&id=" . $row['id'] ."\">";
                $str = $str . "<button type=\"submit\">✔️</button>";
                $str = $str . "</form>";
            } else {
                $str = $str . "<form method=\"POST\" action=\"/?action=delete&id=" . $row['id'] ."\">";
                $str = $str . "<button type=\"submit\">❌</button>";
                $str = $str . "</form>";
            }
            $str = $str . "</li>";
            echo $str;
            //
            // <li><label>$row['todo']</label><form method="DELETE" action="/?action=delete&id=$row['id']"></form></li>'
            
            // <?php
        }
        ?>
    </ul>
    <form method="POST" action="/?action=add">
        <div class="todo_input"><input type="text" name="text" /><button type="submit">➕</button></div>
    </form>
</main>
<?php

// Insert some sample data.
// $db->query('INSERT INTO "users" ("name") VALUES ("Karl")');
// $db->query('INSERT INTO "users" ("name") VALUES ("Linda")');
// $db->query('INSERT INTO "users" ("name") VALUES ("John")');

// // Get a count of the number of users
// $userCount = $db->querySingle('SELECT COUNT(DISTINCT "id") FROM "users"');
// echo("User count: $userCount\n");

// Close the connection
$db->close();
?>

</body>
</html>