describe('OEEyeDraw - EyeDraw Widget init', function() {

	describe('EyeDraw init', function() {

		it('should create a new ED.Controller instance with the correct properties', function() {

			var stub = sinon.stub(ED, 'Controller');

			var properties = {
				some: 'prop'
			};

			ED.init(properties);

			expect(stub.calledOnce).to.be.true;
			expect(stub.calledWithNew()).to.be.true;
			expect(stub.calledWith(properties)).to.be.true;

			stub.restore();
		});
	});
});