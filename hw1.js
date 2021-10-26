var canvas;
var gl;

var maxNumVertices  = 10000;
var index = 0;
var redraw = false;

var indexValuesArr = [];    // holds index values such as
                            // 0 16 20 23 45 ...
indexValuesArr.push(0);
var shapeArr = [];          // holds string of shapes such as
                            // "brush" "rectangle" "triangle" "brush" ...

var undoRedoIndex = 0;      //index that is used in indexValuesArr to know where the next undo or redo is performed
var shapeArrIndex = -1;     //index that is used in shapeArr to know where the next undo or redo is performed

var brush = true;
var rectangle = false;
var triangle = false;
var ellipse = false;
var erase = false;

var drag = false; //a flag indicating the drag has begun
var eraseFlag = false; //a flag indicating the erase has begun

var t1 = vec2;
var t2 = vec2;

var vertexArr = [];

var colorIndex = 1;

var colors = [
    vec4( 1.0, 0.5, 0.0, 1.0 ),  // orange
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 0.5, 0.0, 1.0, 1.0 )  // purple
];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    canvas.addEventListener("mousedown", function(event){
        if(erase)
        {
            eraseFlag = true;
        }
        else{
            while(undoRedoIndex !== (indexValuesArr.length - 1))
            {
                indexValuesArr.pop();
                shapeArr.pop();
            }
            index = indexValuesArr[indexValuesArr.length - 1];
            console.log("Index : " + index);
            console.log("vertexarr Length : " + vertexArr.length)
            while(2 * index !== vertexArr.length)
            {
                console.log("removing from vertexArr");
                vertexArr.shift();
            }
            
            if(brush){
                redraw = true;
                shapeArr.push("brush");
            }
            else if(rectangle)
            {
                t1 = vec2(2*event.clientX/canvas.width-1, 
                    2*(canvas.height-event.clientY)/canvas.height-1);
                drag = true;
                shapeArr.push("rectangle");
            }
            else if(triangle)
            {
                t1 = vec2(2*event.clientX/canvas.width-1, 
                    2*(canvas.height-event.clientY)/canvas.height-1);
                drag = true;
                shapeArr.push("triangle");
            }
            else if(ellipse)
            {
                t1 = vec2(2*event.clientX/canvas.width-1, 
                    2*(canvas.height-event.clientY)/canvas.height-1);
                drag = true;
                shapeArr.push("ellipse");
            }
            shapeArrIndex = (shapeArr.length - 1);
            console.log("shapeArrIndex :" + shapeArrIndex);
            console.log("shapeArr : ");
            console.log(shapeArr);
        }
    });

    canvas.addEventListener("mouseup", function(event){
        if(brush){
            redraw = false;
            indexValuesArr.push(index);
            undoRedoIndex = (indexValuesArr.length - 1);
            console.log("undoRedoIndex : " + undoRedoIndex);
            console.log("indexValuesArr : ");
            console.log(indexValuesArr);
        }
        else if(rectangle)
        {
            drag = false;

            t2 = vec2(2*event.clientX/canvas.width-1, 
                2*(canvas.height-event.clientY)/canvas.height-1);
            t3 = vec2(t1[0], t2[1]);
            t4 = vec2(t2[0], t1[1]);

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t2));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));

            vertexArr.unshift(t1[1]); // y
            vertexArr.unshift(t1[0]); // x
            vertexArr.unshift(t3[1]);
            vertexArr.unshift(t3[0]);
            vertexArr.unshift(t2[1]);
            vertexArr.unshift(t2[0]);
            vertexArr.unshift(t4[1]);
            vertexArr.unshift(t4[0]);

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colors[colorIndex]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(colors[colorIndex]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(colors[colorIndex]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+3), flatten(colors[colorIndex]));

            index += 4;
            //console.log("Index: " + index);
            //console.log("vertexArr.length : " + vertexArr.length);
            indexValuesArr.push(index);
            undoRedoIndex = (indexValuesArr.length - 1);
            console.log("undoRedoIndex : " + undoRedoIndex);
            console.log("indexValuesArr : ");
            console.log(indexValuesArr);
            console.log(vertexArr);
        }
        else if(triangle)
        {
            drag = false;

            t2 = vec2(2*event.clientX/canvas.width-1, 
                2*(canvas.height-event.clientY)/canvas.height-1);
            t3 = vec2(t1[0], t2[1]);
            t4 = vec2(t2[0], t1[1]);

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t4));

            vertexArr.unshift(t1[1]); // y
            vertexArr.unshift(t1[0]); // x
            vertexArr.unshift(t3[1]);
            vertexArr.unshift(t3[0]);
            vertexArr.unshift(t4[1]);
            vertexArr.unshift(t4[0]);

            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colors[colorIndex]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(colors[colorIndex]));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(colors[colorIndex]));

            index += 3;
            //console.log("Index: " + index);
            //console.log("vertexArr.length : " + vertexArr.length);
            indexValuesArr.push(index);
            undoRedoIndex = (indexValuesArr.length - 1);
            console.log("undoRedoIndex : " + undoRedoIndex);
            console.log("indexValuesArr : ");
            console.log(indexValuesArr);
            console.log(vertexArr);
        }
        else if(ellipse)
        {
            drag = false;

            t2 = vec2(2*event.clientX/canvas.width-1, 
                2*(canvas.height-event.clientY)/canvas.height-1);

            centerX = (t1[0] + t2[0]) / 2;
            centerY = (t1[1] + t2[1]) / 2;
            console.log("centerX : " + centerX);
            console.log("centerY : " + centerY);

            // according to ellipse equation
            radiusY = Math.abs(centerY - t1[1]);
            radiusX = Math.abs(centerX - t1[0]);
            console.log("radiusY : " + radiusY);
            console.log("radiusX : " + radiusX);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            for(i = 0; i < 16; i++)
            {
                t = vec2(centerX + radiusX * Math.cos(i * Math.PI / 8),centerY + radiusY * Math.sin(i * Math.PI/8));

                gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index + i), flatten(t));
                vertexArr.unshift(t[1]); // y
                vertexArr.unshift(t[0]); // x
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
            for(i = 0; i < 16; i++)
            {
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index + i), flatten(colors[colorIndex]));
            }
            index += 16;
            //console.log("Index: " + index);
            //console.log("vertexArr.length : " + vertexArr.length);
            indexValuesArr.push(index);
            undoRedoIndex = (indexValuesArr.length - 1);
            console.log("undoRedoIndex : " + undoRedoIndex);
            console.log("indexValuesArr : ");
            console.log(indexValuesArr);
            console.log(vertexArr);
        }
        else if(erase)
        {
            eraseFlag = false;
        }
    });
    //canvas.addEventListener("mousedown", function(){
    canvas.addEventListener("mousemove", function(event)
    {
        if(brush)
        {
            if(redraw)
            {
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                var t = vec2(2*event.clientX/canvas.width-1,
                    2*(canvas.height-event.clientY)/canvas.height-1);
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t));

                vertexArr.unshift(t[1]); //y
                vertexArr.unshift(t[0]); //x

                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colors[colorIndex]));
                index++;
                //console.log("Index: " + index);
                //console.log("vertexArr.length : " + vertexArr.length);


            }
        }
        else if(rectangle)
        {
            if(drag)
            {
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                t2 = vec2(2*event.clientX/canvas.width-1, 
                    2*(canvas.height-event.clientY)/canvas.height-1);
                //console.log("MOUSE MOVE t2 : " + t2);
                t3 = vec2(t1[0], t2[1]);
                t4 = vec2(t2[0], t1[1]);

                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t2));
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));

                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colors[colorIndex]));
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(colors[colorIndex]));
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(colors[colorIndex]));
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+3), flatten(colors[colorIndex]));
            }
        }
        else if(triangle)
        {
            if(drag)
            {
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                t2 = vec2(2*event.clientX/canvas.width-1, 
                    2*(canvas.height-event.clientY)/canvas.height-1);
                //console.log("MOUSE MOVE t2 : " + t2);
                t3 = vec2(t1[0], t2[1]);
                t4 = vec2(t2[0], t1[1]);

                gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
                gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t4));

                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colors[colorIndex]));
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(colors[colorIndex]));
                gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(colors[colorIndex]));
            }
        }
        else if(ellipse)
        {
            if(drag)
            {
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                t2 = vec2(2*event.clientX/canvas.width-1, 
                    2*(canvas.height-event.clientY)/canvas.height-1);
    
                centerX = (t1[0] + t2[0]) / 2;
                centerY = (t1[1] + t2[1]) / 2;
    
                // according to ellipse equation
                radiusY = Math.abs(centerY - t1[1]);
                radiusX = Math.abs(centerX - t1[0]);
    
                for(i = 0; i < 16; i++)
                {
                    t = vec2(centerX + radiusX * Math.cos(i * Math.PI / 8),centerY + radiusY * Math.sin(i * Math.PI/8));
    
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index + i), flatten(t));
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                for(i = 0; i < 16; i++)
                {
                    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index + i), flatten(colors[colorIndex]));
                }
            }
        }
        else if(erase)
        {
            if(eraseFlag)
            {
                var t = vec2(2*event.clientX/canvas.width-1,
                    2*(canvas.height-event.clientY)/canvas.height-1);
                
                // search through all verteces
                for(i = 0; i < index; i++)
                {
                    // compare the distance
                    if(Math.sqrt(Math.pow(t[0] - vertexArr[(2 * index) - 2 - (2 * i)], 2) + Math.pow(t[1] - vertexArr[(2 * index) - 1 - (2 * i)], 2)) <= 0.04)
                    {
                        // get the index place inside the indexValuesArr
                        for(k = 0; k < indexValuesArr.length; k++)
                        {
                            if(i <= indexValuesArr[k])
                            {
                                break;
                            }
                        }
                        console.log("k = " + k);

                        if(k === 0)
                        {
                            if(0 === (shapeArr[0].localeCompare("brush")))
                            {
                                if(indexValuesArr[1] === 1)
                                {
                                    for(j = 1; j < indexValuesArr.length - 1; j++)
                                    {
                                        shapeArr[j - 1] = shapeArr[j];
                                        indexValuesArr[j] = indexValuesArr[j + 1] - 1;
                                    }
                                    indexValuesArr.pop();
                                    shapeArr.pop();
                                    undoRedoIndex--;
                                    shapeArrIndex--;
                                    console.log(shapeArr);
                                }
                                else
                                {
                                    for(j = 1; j < indexValuesArr.length; j++)
                                    {
                                        indexValuesArr[j]--;
                                    }
                                }
                                console.log(indexValuesArr);
                                for(j = ((2 * index) - (1 + (2 * (i + 1)))); j >=0; j--)
                                {
                                    vertexArr[j + 2] = vertexArr[j];
                                }
                                vertexArr.shift();
                                vertexArr.shift();
                                index--;
                            }
                        }
                        else if(k === (indexValuesArr.length - 1))
                        {
                            if(0 === (shapeArr[k - 1].localeCompare("brush")))
                            {
                                if((indexValuesArr[k] - indexValuesArr[k - 1]) === 1)
                                {
                                    indexValuesArr.pop();
                                    undoRedoIndex--;
                                    shapeArr.pop();
                                    shapeArrIndex--;
                                }
                                else{
                                    indexValuesArr[k]--;
                                }
                                for(j = ((2 * index) - (1 + (2 * (i + 1)))); j >=0; j--)
                                {
                                    vertexArr[j + 2] = vertexArr[j];
                                }
                                vertexArr.shift();
                                vertexArr.shift();
                                index--;
                            }
                        }
                        else
                        {
                            if(0 === (shapeArr[k - 1].localeCompare("brush")) && indexValuesArr[k] !== i)
                            {
                                if((indexValuesArr[k] - indexValuesArr[k - 1]) === 1)
                                {
                                    for(j = k; j < indexValuesArr.length - 1; j++)
                                    {
                                        shapeArr[j - 1] = shapeArr[j];
                                        indexValuesArr[j] = indexValuesArr[j + 1] - 1;
                                    }
                                    indexValuesArr.pop();
                                    undoRedoIndex--;
                                    shapeArr.pop();
                                    shapeArrIndex--;
                                }
                                else
                                {
                                    for(j = k; j < indexValuesArr.length; j++)
                                    {
                                        indexValuesArr[j]--;
                                    }
                                }
                                for(j = ((2 * index) - (1 + (2 * (i + 1)))); j >=0; j--)
                                {
                                    vertexArr[j + 2] = vertexArr[j];
                                }
                                vertexArr.shift();
                                vertexArr.shift();
                                index--;
                            }
                            else if(0 === (shapeArr[k].localeCompare("brush")) && indexValuesArr[k] === i)
                            {
                                if((shapeArr[k + 1] === undefined) && ((indexValuesArr[k + 1] - indexValuesArr[k]) === 1))
                                {
                                    indexValuesArr.pop();
                                    undoRedoIndex--;
                                    shapeArr.pop();
                                    shapeArrIndex--;
                                }
                                else if((shapeArr[k + 1] === undefined) && ((indexValuesArr[k + 1] - indexValuesArr[k]) !== 1))
                                {
                                    indexValuesArr[k + 1]--;
                                    console.log(indexValuesArr);
                                }
                                else if((indexValuesArr[k + 1] - indexValuesArr[k]) === 1)
                                {
                                    for(j = k; j < indexValuesArr.length - 2; j++)
                                    {
                                        shapeArr[j] = shapeArr[j+1];
                                        indexValuesArr[j] = indexValuesArr[j + 1] - 1;
                                    }
                                    indexValuesArr[j] = indexValuesArr[j + 1] - 1;
                                    indexValuesArr.pop();
                                    undoRedoIndex--;
                                    shapeArr.pop();
                                    shapeArrIndex--;
                                }
                                else if((indexValuesArr[k + 1] - indexValuesArr[k]) !== 1)
                                {
                                    for(j = k + 1; j < indexValuesArr.length; j++)
                                    {
                                        indexValuesArr[j]--;
                                    }
                                }
                                for(j = ((2 * index) - (1 + (2 * (i + 1)))); j >=0; j--)
                                {
                                    vertexArr[j + 2] = vertexArr[j];
                                }
                                vertexArr.shift();
                                vertexArr.shift();
                                index--;
                            }
                        }
                        
                        console.log(shapeArr);
                        console.log(indexValuesArr);
                    }
                }
                console.log("index : " + index);
                gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
                
                for(i = 0; i < index; i++){
                    var vec = vec2(vertexArr[(2 * index) - 2 - (2 * i)],vertexArr[(2 * index) - 1 - (2 * i)]);
                    gl.bufferSubData(gl.ARRAY_BUFFER, 8*i, flatten(vec));
                }
            }
        }
    });

    if(true){
        document.getElementById("undoButton").onclick = function () {
            if(shapeArrIndex >= 0)
            {
                console.log("undo redo index BEFORE UNDO button : " + undoRedoIndex);
                undoRedoIndex--;
                console.log("undo redo index AFTER UNDO button : " + undoRedoIndex);
                shapeArrIndex--;
                console.log("shapeArrIndex AFTER UNDO button : " + shapeArrIndex);
            }
        };
        document.getElementById("redoButton").onclick = function () {
            if(undoRedoIndex < indexValuesArr.length - 1)
            {
                console.log("undo redo index BEFORE REDO: " + undoRedoIndex);
                undoRedoIndex++;
                console.log("undo redo index AFTER REDO: " + undoRedoIndex);
                shapeArrIndex++;
            }
        };
        document.getElementById("rectangleButton").onclick = function () {
            brush = false;
            rectangle = true;
            triangle = false;
            ellipse = false;
            erase = false;
        };
        document.getElementById("triangleButton").onclick = function () {
            brush = false;
            rectangle = false;
            triangle = true;
            ellipse = false;
            erase = false;
        };
        document.getElementById("ellipseButton").onclick = function () {
            brush = false;
            rectangle = false;
            triangle = false;
            ellipse = true;
            erase = false;
        };
        document.getElementById("brushButton").onclick = function () {
            brush = true;
            rectangle = false;
            triangle = false;
            ellipse = false;
            erase = false;
        };
        document.getElementById("eraseButton").onclick = function () {
            brush = false;
            rectangle = false;
            triangle = false;
            ellipse = false;
            erase = true;
        };
        document.getElementById("greenColorButton").onclick = function () {colorIndex = 3;};
        document.getElementById("blueColorButton").onclick = function () {colorIndex = 4;};
        document.getElementById("redColorButton").onclick = function () {colorIndex = 1;};
        document.getElementById("yellowColorButton").onclick = function () {colorIndex = 2;};
        document.getElementById("orangeColorButton").onclick = function () {colorIndex = 0;};
        document.getElementById("cyanColorButton").onclick = function () {colorIndex = 6;};
        document.getElementById("magentaColorButton").onclick = function () {colorIndex = 5;};
        document.getElementById("purpleColorButton").onclick = function () {colorIndex = 7;};

        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

        //
        //  Load shaders and initialize attribute buffers
        //
        var program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );


        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        render();
    }

}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );
    
    for(i = 0; i <= shapeArrIndex; i++)
    {
        if(0 === (shapeArr[i].localeCompare("brush")))
        {
            if(indexValuesArr[i + 1] === undefined){
                gl.drawArrays( gl.POINTS, indexValuesArr[i], index - indexValuesArr[i]);
            }
            else{
                gl.drawArrays( gl.POINTS, indexValuesArr[i], indexValuesArr[i + 1] - indexValuesArr[i]);
            }
        }
        else if(0 === (shapeArr[i].localeCompare("rectangle")))
        {
            if(indexValuesArr[i + 1] === undefined)
            {
                if(drag)
                {
                    gl.drawArrays( gl.LINE_LOOP, index, 4 );
                }
            }
            else{
                gl.drawArrays( gl.TRIANGLE_FAN, indexValuesArr[i], 4 );
            }
        }
        else if(0 === (shapeArr[i].localeCompare("triangle")))
        {
            if(indexValuesArr[i + 1] === undefined)
            {
                if(drag)
                {
                    gl.drawArrays( gl.LINE_LOOP, index, 3 );
                }
            }
            else{
                gl.drawArrays( gl.TRIANGLES, indexValuesArr[i], 3 );
            }
        }
        else if(0 === (shapeArr[i].localeCompare("ellipse")))
        {
            if(indexValuesArr[i + 1] === undefined)
            {
                if(drag)
                {
                    gl.drawArrays( gl.LINE_LOOP, index, 16 );
                }
            }
            else{
                gl.drawArrays( gl.TRIANGLE_FAN, indexValuesArr[i], 16 );
            }
        }
    }
    window.requestAnimFrame(render);

}
