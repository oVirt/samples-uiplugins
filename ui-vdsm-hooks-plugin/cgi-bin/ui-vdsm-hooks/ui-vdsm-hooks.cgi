#!/usr/bin/python

import cgi
import json
import re
import subprocess as sub

def executeCommand(command):
    if command in commands:
        return commands[command]()
    return "Error: command is not supported"

def executeVdsCommand(command='', args={}):
    cmd = ['vdsClient', '0', command] + args
    output = sub.Popen(cmd, stdout=sub.PIPE).stdout.read().rstrip('\n')
    return cgi.escape(output)

def getConnectedStoragePoolsList():
    return executeVdsCommand("getConnectedStoragePoolsList", [])

def disconnectStoragePool():
    spID = executeCommand("getConnectedStoragePoolsList")
    return executeVdsCommand("disconnectStoragePool", [ spID, '0', '0' ])

def getStorageDomainsList():
    spID = executeCommand("getConnectedStoragePoolsList")
    return executeVdsCommand("getStorageDomainsList", [ spID ])

def spmStop():
    spID = executeCommand("getConnectedStoragePoolsList")
    return executeVdsCommand("spmStop", [ spID ])

def getAllTasks():
    return executeVdsCommand("getAllTasks", [])

def stopAllTasks():
    return forEachTaskExecute("stopTask")

def clearAllTasks():
    return forEachTaskExecute("clearTask")

def forEachTaskExecute(vdsCmd):
    taskIDs = re.findall("id = [\w,-]*", getAllTasks())
    for taskID in taskIDs:
        uuid = taskID.replace("id = ", "")
        executeVdsCommand(vdsCmd, [ uuid ])
    return ""

def runScript():
    form = cgi.FieldStorage()
    scriptFile = form.getfirst("args", "")
    return sub.Popen("scripts/" + scriptFile, stdout=sub.PIPE).stdout.read()

commands = {
    'runScript': runScript,
    'getAllTasks': getAllTasks,
    'stopAllTasks': stopAllTasks,
    'clearAllTasks': clearAllTasks,
    'getStorageDomainsList': getStorageDomainsList,
    'getConnectedStoragePoolsList': getConnectedStoragePoolsList,
    'disconnectStoragePool': disconnectStoragePool,
    'spmStop': spmStop,
}

def printOutput(output):
    try:
        parsedJson = json.loads(output.replace("'", '"'))
        printFormattedHTML(json.dumps(parsedJson, indent=4))
    except:
        printFormattedHTML(output)

def printFormattedHTML(str):
    print str.replace('\n', '<br/>').replace('    ', '&emsp;').replace('\t', '&emsp;')

def main():
    # Get URL parameters
    form = cgi.FieldStorage()
    command = form.getfirst("command", "")

    # Print HTML header
    print "Content-Type: text/html\n\n"
    if not command == 'runScript':
        print "<b>Output:</b><br/><br/>"

    # Execute command
    output = executeCommand(command)
    printOutput(output)

try:
    main()
except:
    cgi.print_exception()

