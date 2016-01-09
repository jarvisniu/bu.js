# concat tool
# Jarvis Niu - http://github.com/jarvisniu/
print("concating...")
import os
import time

srcDir = "../../../src/"
buildDir = "../../../build/"
versionDir = "versions/"

versionExt = ".txt"
libExt = ".js"

def buildVersion(file):
    filenames = open(versionDir + file, "r", encoding="utf-8").read().split('\n')
    jsName = file.replace(versionExt, libExt)
    print("Building: " + jsName + " . . .")
    libContent = "// " + jsName + "\n"
    libContent += "// Generated: " + time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())  + "\n" * 2
    for filename in filenames:
        filename = filename.strip()
        if len(filename) > 0:
            jsText = open(srcDir + filename + libExt, encoding="utf-8").read()
            libContent += "// File: " + filename + libExt + "\n" * 2
            libContent += jsText + "\n"
    open(buildDir + jsName, "w", encoding="utf-8").write(libContent)

for root, dirs, files in os.walk(versionDir):
    for file in files:
        buildVersion( file )
    print("Build completed.")
