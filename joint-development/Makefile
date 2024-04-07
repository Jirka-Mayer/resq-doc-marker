.PHONY:	all clean clone package-json install

all: clean clone package-json install

clean:
	rm -rf doc-marker resq-customization node_modules dist package-lock.json .parcel-cache

clone:
	git clone git@github.com:Jirka-Mayer/doc-marker.git doc-marker
	git clone git@github.com:Jirka-Mayer/resq-doc-marker.git resq-customization

package-json:
	node setupPackage.js

install:
	npm install
	rm -rf doc-marker/dist doc-marker/.parcel-cache
