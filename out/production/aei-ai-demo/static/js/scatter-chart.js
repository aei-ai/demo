//====================================================
//                 Scatter chart
//====================================================

/**
 * Creates a text canvas with given properties.
 * @param text Text to show.
 * @param color Text color.
 * @param font Text font name.
 * @param size Font size.
 * @return {Element} Text canvas.
 */
function createTextCanvas(text, color, font, size) {
    var canvas = document.createElement('canvas');
    size = size || 12;
    var ctx = canvas.getContext('2d');
    var fontStr = (size + 'px ') + (font || 'Arial');
    ctx.font = fontStr;
    var w = ctx.measureText(text).width;
    var h = Math.ceil(size);
    canvas.width = w;
    canvas.height = h;
    ctx.font = fontStr;
    ctx.fillStyle = color || 'black';
    ctx.fillText(text, 0, Math.ceil(size * 0.8));
    return canvas;
}

/**
 * Creates a 2D text with given properties
 * @param text Text to show.
 * @param color Text color.
 * @param font Text font name.
 * @param size Font size.
 * @param segW Width of text container.
 * @param segH Height of text container.
 * @return {THREE.Mesh}
 */
function createText2D(text, color, font, size, segW, segH) {
    var canvas = createTextCanvas(text, color, font, size);
    var plane = new THREE.PlaneGeometry(canvas.width, canvas.height, segW, segH);
    var tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    var planeMat = new THREE.MeshBasicMaterial({
        map: tex,
        color: 0xffffff,
        transparent: true
    });
    var mesh = new THREE.Mesh(plane, planeMat);
    mesh.scale.set(0.5, 0.5, 0.5);
    mesh.doubleSided = true;
    return mesh;
}

var scatterChart = function (d3) {
    var scatterChart = {};

    // chart size
    var w = 250;
    var h = 250;

    // WebGL renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColorHex(0xFFFFFF, 1.0);
    document.getElementById('affect-scatter-chart').appendChild(renderer.domElement);

    // camera
    var camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000);
    camera.position.x = -w / 2 ;  // x is pleasure
    camera.position.y = w / 4 ;  // y is arousal
    camera.position.z = w / 2 ;  // z is dominance

    // plot
    var scatterPlot = new THREE.Object3D();
    scatterPlot.rotation.y = -0.55;

    // scene
    var scene = new THREE.Scene();
    scene.add(scatterPlot);

    // creates a vector with given coordinates
    function v(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    // ranges of pleasure, arousal, and dominance
    var xRange = [-1, 1], yRange = [-1, 1], zRange = [-1, 1];

    // axis points
    var vpts = {
        xMax: xRange[1], xCen: (xRange[1] + xRange[0]) / 2, xMin: xRange[0],
        yMax: yRange[1], yCen: (yRange[1] + yRange[0]) / 2, yMin: yRange[0],
        zMax: zRange[1], zCen: (zRange[1] + zRange[0]) / 2, zMin: zRange[0]
    };

    // scaling in each dimension
    var xScale = d3.scale.linear().domain(xRange).range([-w / 5, w / 5]);
    var yScale = d3.scale.linear().domain(yRange).range([-w / 5, w / 5]);
    var zScale = d3.scale.linear().domain(zRange).range([-w / 5, w / 5]);

    // axis lines
    var lineGeo = new THREE.Geometry();
    lineGeo.vertices.push(
        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zCen)),
        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zCen)),
        v(xScale(vpts.xCen), yScale(vpts.yCen), zScale(vpts.zMax)), v(xScale(vpts.xCen), yScale(vpts.yCen), zScale(vpts.zMin)),

        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMax)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMax)),
        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMin)),
        v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zCen)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zCen)),

        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMax)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMin)),
        v(xScale(vpts.xMax), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xMax), yScale(vpts.yMax), zScale(vpts.zCen)),
        v(xScale(vpts.xMin), yScale(vpts.yMin), zScale(vpts.zCen)), v(xScale(vpts.xMin), yScale(vpts.yMax), zScale(vpts.zCen)),

        v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMin)), v(xScale(vpts.xMin), yScale(vpts.yCen), zScale(vpts.zMax)),
        v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMin)), v(xScale(vpts.xMax), yScale(vpts.yCen), zScale(vpts.zMax)),
        v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMin)), v(xScale(vpts.xCen), yScale(vpts.yMax), zScale(vpts.zMax)),
        v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMin)), v(xScale(vpts.xCen), yScale(vpts.yMin), zScale(vpts.zMax))
    );

    // axis lines color and width
    var lineMat = new THREE.LineBasicMaterial({
        color: 0xBEBEBE,
        lineWidth: 1
    });

    // draw lines
    var line = new THREE.Line(lineGeo, lineMat);
    line.type = THREE.Lines;
    scatterPlot.add(line);

    // axis titles
    var titleX = createText2D('-P');
    titleX.position.x = xScale(vpts.xMin) - 10;
    scatterPlot.add(titleX);

    var titleX = createText2D('+P');
    titleX.position.x = xScale(vpts.xMax) + 10;
    scatterPlot.add(titleX);

    var titleY = createText2D('-A');
    titleY.position.y = yScale(vpts.yMin) - 10;
    scatterPlot.add(titleY);

    var titleY = createText2D('+A');
    titleY.position.y = yScale(vpts.yMax) + 10;
    scatterPlot.add(titleY);

    var titleZ = createText2D('-D');
    titleZ.position.z = zScale(vpts.zMin) - 10;
    scatterPlot.add(titleZ);

    var titleZ = createText2D('+D');
    titleZ.position.z = zScale(vpts.zMax) + 10;
    scatterPlot.add(titleZ);

    var mat = new THREE.ParticleBasicMaterial({
        vertexColors: true,
        size: 10
    });

    var paused = false;
    var last = new Date().getTime();
    var down = false;
    var sx = 0,
        sy = 0;

    window.onmousedown = function (ev) {
        down = true;
        sx = ev.clientX;
        sy = ev.clientY;
    };
    window.onmouseup = function () {
        down = false;
    };
    window.onmousemove = function (ev) {
        if (down) {
            var dx = ev.clientX - sx;
            var dy = ev.clientY - sy;
            scatterPlot.rotation.y += dx * 0.01;
            camera.position.y += dy;
            sx += dx;
            sy += dy;
        }
    };
    var animating = false;
    window.ondblclick = function () {
        animating = !animating;
    };

    function animate(t) {
        if (!paused) {
            last = t;
            if (animating) {
                var v = pointGeo.vertices;
                for (var i = 0; i < v.length; i++) {
                    var u = v[i];
                    u.angle += u.speed * 0.01;
                    u.x = Math.cos(u.angle) * u.radius;
                    u.z = Math.sin(u.angle) * u.radius;
                }
                pointGeo.__dirtyVertices = true;
            }
            renderer.clear();
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
        window.requestAnimationFrame(animate, renderer.domElement);
    };

    onmessage = function (ev) {
        paused = (ev.data == 'pause');
    };

    function refreshChart() {
        var dataPoints = [];
        var emotion = affectData.Affect.Emotion;
        var mood = affectData.Affect.Mood;
        var personality = affectData.Affect.Personality.PAD;

        dataPoints.push({
            x: emotion.Pleasure[emotion.Pleasure.length - 1],
            y: emotion.Arousal[emotion.Arousal.length - 1],
            z: emotion.Dominance[emotion.Dominance.length - 1],
            description: 'Emotion',
            color: 0x93648D,
        });

        dataPoints.push({
            x: mood.Pleasure[mood.Pleasure.length - 1],
            y: mood.Arousal[mood.Arousal.length - 1],
            z: mood.Dominance[mood.Dominance.length - 1],
            description: 'Mood',
            color: 0xFFC65D,
        });

        dataPoints.push({
            x: personality.Pleasure[personality.Pleasure.length - 1],
            y: personality.Arousal[personality.Arousal.length - 1],
            z: personality.Dominance[personality.Dominance.length - 1],
            description: 'Personality',
            color: 0x7BC8A4,
        });

        var pointCount = dataPoints.length;
        var pointGeo = new THREE.Geometry();
        for (var i = 0; i < pointCount; i++) {
            var x = xScale(dataPoints[i].x);
            var y = yScale(dataPoints[i].y);
            var z = zScale(dataPoints[i].z);

            pointGeo.vertices.push(new THREE.Vector3(x, y, z));
            pointGeo.colors.push(new THREE.Color().setHex(dataPoints[i].color));
        }

        var points = new THREE.ParticleSystem(pointGeo, mat);
        scatterPlot.add(points);
        renderer.render(scene, camera);
        animate(new Date().getTime());
    }

    // refresh the sunburst chart and return it
    scatterChart.refreshChart = refreshChart;
    return scatterChart;
}(d3);
