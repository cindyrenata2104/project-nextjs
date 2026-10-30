Set oShell = CreateObject("Shell.Application")
oShell.ShellExecute "cmd.exe", "/c """ & "C:\Users\cindy\Documents\project-nextjs\perbaiki_postgres.bat" & """", "", "runas", 1
