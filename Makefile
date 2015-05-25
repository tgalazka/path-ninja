clean:
	rm -rf node_modules

install:
	npm install

wrap:
	npm shrinkwrap

unwrap:
	rm -rf npm-shrinkwrap.json

rewrap: unwrap clean install wrap

unit:
	node node_modules/mocha/bin/mocha test/unit 

test: unit
