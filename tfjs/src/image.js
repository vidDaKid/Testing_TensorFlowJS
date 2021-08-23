function stringToImage (string, img_size=500, surrounding_val=0.5) {
	// Can change this beggining based on how the string comes
	const data = JSON.parse(string)
	const points = data.lines[0].points
	// Create an array of zeros
	let n = new Array()
	for(y=0;y<img_size;y++){
		n[y] = new Array()
		for(x=0;x<img;x++) {
			n[y,x] = 0	
		}
	}
	
	// Turn the ones into zeros wherever there is a point
	for(i=0;i<points.length;i++) {
		let x = i.x
		let y = i.y
		
		if (x > img_size-1) {
			x = img_size-1
		} else if (x < 0) {
			x = 0
		}

		if (y > img_size-1) {
			y = img_size-1
		} else if (y < 0) {
			y = 0
		}

		// Store the updated pixel value
		n[y,x] = 255
	}

	return n
}

export default stringToImage;
