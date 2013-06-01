#!/usr/bin/python

import cgi
import json
import os
import subprocess as sub

def executeVdsCommand(command='', args=[]):
    cmd = ['vdsClient', '0', command] + args
    return sub.Popen(cmd, stdout=sub.PIPE).stdout.read().rstrip('\n')

def getVdsClientAPI():
    output = executeVdsCommand()
    return output[output.find('Commands')+9:]

def getApiCmds(api):
    lines = api.split('\n')
    cmds = []
    cmd = ''

    for line in lines:
        if not line.startswith('\t'):
            cmds.append(cmd)
            cmd = ''
        cmd += line + '\n'

    cmds[0] = 'Select a command'

    return cmds

def createForm(apiCmds, selectedIndex=0):
    scriptFile = os.path.dirname(__file__).replace('/var/www', '') + '/vdsClientApi.py'
    print '<form action="' + scriptFile + '">'
    createSelectBox(apiCmds, selectedIndex)
    createCmdDescription(apiCmds, selectedIndex)
    createTextArea(selectedIndex)
    print '</form>'

def createSelectBox(apiCmds, selectedIndex):
    print '<select name="cmdDropDown" onchange="this.form.submit();">'
    for i in range(0, len(apiCmds)):
        label = apiCmds[i].split('\n')[0]
        selected = 'selected' if selectedIndex == i else ''
        print '<option value="' + str(i) + '" ' + selected + '>' + label + '</option>'
    print '</select>'
    print '<br/><br/>'

def createCmdDescription(apiCmds, selectedIndex):
    if selectedIndex == 0:
        return

    printFormattedHTML(apiCmds[selectedIndex])
    print '<br/>'

def createTextArea(selectedIndex):
    if selectedIndex == 0:
        return

    cmdArgs = getFormValue('cmdArgs')
    cmdExecuteBtn = getFormValue('cmdExecuteBtn')
    text = cmdArgs if (cmdArgs and cmdExecuteBtn) else ''

    print '<textarea name="cmdArgs" cols="60" rows="2" placeholder="Type arguments here">'
    print text + '</textarea><br/><br/>'
    print '<input type="submit" name="cmdExecuteBtn" value="Execute"'
    print '<br/>'

def handleSelection(apiCmds, selectedIndex):
    print 'Content-Type: text/html\n\n'
    print '<br/>'
    createForm(apiCmds, selectedIndex)

def handleExecute(apiCmds, selectedIndex, cmdArgs):
    cmd = apiCmds[selectedIndex].split('\n')[0]
    args = cmdArgs.split(' ') if cmdArgs else []
    output = executeVdsCommand(cmd, args)

    print '<b>Output:</b><br/>'

    try:
        parsedJson = json.loads(output.replace("'", '"'))
        printFormattedHTML(json.dumps(parsedJson, indent=4))
    except:
        printFormattedHTML(output)

def printFormattedHTML(str):
    escaped = cgi.escape(str)
    print escaped.replace('\n', '<br/>').replace('    ', '&emsp;').replace('\t', '&emsp;')

def getFormValue(key):
    form = cgi.FieldStorage()
    return form.getvalue(key)

def main():
    api = getVdsClientAPI()
    apiCmds = getApiCmds(api)

    form = cgi.FieldStorage()
    selectedIndex = getFormValue('cmdDropDown')
    cmdArgs = getFormValue('cmdArgs')
    cmdExecuteBtn = getFormValue('cmdExecuteBtn')

    if selectedIndex:
        handleSelection(apiCmds, int(selectedIndex))
    else:
        createForm(apiCmds)

    if cmdExecuteBtn:
        handleExecute(apiCmds, int(selectedIndex), cmdArgs)

try:
    main()
except:
    cgi.print_exception()

