BIN = ./node_modules/.bin

node_modules: package.json
	@npm install

# run tests against the coffee source
test: node_modules
	$(BIN)/mocha
