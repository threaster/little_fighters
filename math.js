var m = {
	
	// Winding Number step - determines orientation of point p to edge e
	// p:       [x, y]
	// edge:    [ [x0, y0], [x1, y1] ]
	// returns: positive -> p is left of e, negative -> p is right of e, 0 -> p is on e
	wnStep:function(p, e) {
		return (e[1][0] - e[0][0]) * (p[1] - e[0][1]) - (p[0] - e[0][0]) * (e[1][1] - e[0][1]);
	}
	
	
	
}