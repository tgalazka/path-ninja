clean:
	rm -rf node_modules

install:
	npm install

wrap:
	npm shrinkwrap

unwrap:
	rm -rf npm-shrinkwrap.json
