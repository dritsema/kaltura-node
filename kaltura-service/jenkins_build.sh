#!/bin/sh
npm cache clean
npm install
bower install
grunt build
if [ -n "${RELEASE_VERSION// }" ]
then
	# making sure the value provided is understood by npm command or a valid string of 0.0.0
	if [ "$RELEASE_VERSION" == "patch" ] || [ "$RELEASE_VERSION" == "minor" ] || [ "$RELEASE_VERSION" == "major" ] || [[ "$RELEASE_VERSION" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]
	then
		echo new version  is - $RELEASE_VERSION
		npm version $RELEASE_VERSION -m "incrementing version"
		# checking if git remote setting is missing
		if [[ ! -n $(git remote -v) ]]
		then
			echo setting git remote url inside git config file
			git remote add origin git@github.disney.com:espn-ese-kaltura/kaltura-service.git
		fi
		git push origin --tags
		git push
		grunt webdav_deploy:release
	else
		echo 'Invalid version value. Valid values are- patch, minor, major or in format of 0.0.0'
	fi
fi
