# build tool
# Jarvis Niu - http://github.com/jarvisniu/Geom2D

import os

srcDir = "../../src/"
buildDir = "../../build/"
versionDir = "versions/"

versionExt = ".txt"
libExt = ".js"

def buildVersion(file):
    filenames = open(versionDir + file, "r", encoding="utf-8").read().split('\n')
    jsName = file.replace(versionExt, libExt)
    libContent = "// " + jsName + "\n"
    for filename in filenames:
        filename = filename.strip()
        if len(filename) > 0:
            jsText = open(srcDir + filename + libExt, encoding="utf-8").read()
            libContent += "\n// File: " + filename + libExt + "\n"
            libContent += jsText
    open(buildDir + jsName, "w", encoding="utf-8").write(libContent)

for root, dirs, files in os.walk(versionDir):
    for file in files:
        buildVersion( file )
        