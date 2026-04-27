' GH Cars - Lanzador OCULTO del watcher
' Ejecuta el .bat sin ventana visible. Se arranca solo al iniciar Windows.
Set WshShell = CreateObject("WScript.Shell")
ScriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run Chr(34) & ScriptDir & "\auto-deploy-watcher.bat" & Chr(34), 0, False
Set WshShell = Nothing
