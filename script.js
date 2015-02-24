/**
 * Created by nleoutsa on 1/14/2015.
 */

// VARIABLES
var numSquares = 50;
// var last_key_pressed = "1";
var key_down = false;
var timer_id;




// SET DOCUMENT READY:

$(document).ready(function() {

    $('.numOfSquares').html(numSquares);

    createGrid(numSquares);
    createRGBA();
    createColorPicker();



    $('.moreSquares').click(function() {
        numSquares++;
        $('.numOfSquares').html(numSquares);
        createGrid(numSquares);
    })

    $('.lessSquares').click(function() {
        numSquares--;
        $('.numOfSquares').html(numSquares);
        createGrid(numSquares);
    })

});


function createGrid(numOfSquares) {


    //empty canvas of .grid then create it again so .grid doesn't stack...
    $('.canvas').empty();
    $('.canvas').html("<div class='grid'></div>");

    // establish new square width based on numOfSquares
    squareWidth = (100.0/(parseInt(numOfSquares, 10)));


    // set up grid. Add 10 to id so that numbers are formated "iikk"
    for (var i = 10; i < numOfSquares + 10; i++) {
        for (var k = 10; k < numOfSquares + 10; k++) {
            $this_div = "<div class='square' id='" + i + k + "'></div>";
            $('.grid').append($this_div);
        }
    }
    $('.square').css("width", squareWidth + "%");
    $('.square').css("height", squareWidth + "%");

    draw();


}

function draw() {


    // array to hold filled square ids and colors
    var current_game = [];

    var static_squares = [];
    var moving;
    var stasis = true;

    chooseColor();

    slider($('.redPicker'), $('.redSlider'), $('.red_val'));
    slider($('.greenPicker'), $('.greenSlider'), $('.green_val'));
    slider($('.bluePicker'), $('.blueSlider'), $('.blue_val'));
    slider($('.alphaPicker'), $('.alphaSlider'), "alpha");

    moveSquare();

    /*

     var save_game_number = 0;
     var load_game_number;
     var save_game = [];

    $('.stasis').click(function() {
        stasis = !stasis;
        if (stasis) {
            $(this).css('background-color', "rgba(135, 206, 70, 1)");
        }
        else {
            $(this).css('background-color', "#87cefa");
        }
    });

    $('.play').unbind('mouseup').mouseup(function() {
        moving = !stasis;
    });

    */

    $('.grid').mousedown(function() {
        mouseDown = true;
        moving = stasis;
    });

    $(document).unbind('mouseup').mouseup(function() {
        mouseDown = false;
    });

// draw on mousedown event. necessary because mouseover doesn't register first square
    $('.square').unbind().mousedown(function() {
        currentColor = $('.currentColor').css('background-color');
        $(this).css("background-color", currentColor)

        mouse_down_id = parseInt($(this).attr('id'), 10);

        current_game.push([mouse_down_id, currentColor]);
    });

// draw when mouse is down and mouse is moving.
    $('.square').mouseenter(function() {
        if (mouseDown === true && !key_down) {
            currentColor = $('.currentColor').css('background-color');
            $(this).css("background-color", currentColor);

            mouse_over_id = parseInt($(this).attr('id'), 10);

            current_game.push([mouse_over_id, currentColor]);
        }

    });

    function moveSquare() {

        // direction: set to +1 for right, -1 for left, +100 for down, -100 for up
        var direction = 100;

        current_game.sort(function(a, b){
            return b[0]-a[0];
        });

        if (moving) {

            // iterate over array, updating squares by changing background color
            // of .squares in grid.
            jQuery.each(current_game, function (i, v) {


                $('#' + (v[0] - 100)).css('background-color', 'transparent');
                $('#' + (v[0])).css('background-color', current_game[i][1]);

                // set to "%"(modulo) if left or right... and "/"(division) if up or down
                // subtract 10 to account for formatting earlier...

                var counter = Math.floor(v[0] / 100) - 10;

                $('.stats > span:nth-child(4)').html("counter = " + counter);

                // when square hits the bottom or a stopped square, don't move in direction.
                if (counter >= numSquares - 1 || ($('#' + (v[0] + direction)).hasClass('stopped')) && ($('#' + (v[0] + direction)).css('background-color') != 'transparent')) {
                    $('#' + (v[0])).addClass('stopped');
                }
                // otherwise move square in direction
                else {
                    current_game[i][0] = v[0] + direction;
                }

            });

            for (var f = 0; f < current_game.length; f++) {

                $('.stats > span:nth-child(5)').html(current_game[f][0]);

                if ($('#' + current_game[f][0]).hasClass('stopped')) {

                    current_game.splice(f, 1);

                }
            }

        }

        $('.stats > span:nth-child(1)').html("cur_game= " + current_game.length);
        $('.stats > span:nth-child(2)').html("stat_squ= " + static_squares.length);
        $('.stats > span:nth-child(3)').html("stasis = " + stasis);


        timer_id = setTimeout(moveSquare, 20);
    }

/*
// SAVE GAMES into an array
    $('.save').mousedown(function() {
        clearTimeout(timer_id);
        save_game.push(current_game.slice());
        moving = false;
        $('.saved-games').append('<div class="load btn">' + save_game_number + '</div>');
        save_game_number++;
    });

// LOAD GAMES from array.
    $('.saved-games').mouseover(function() {
        $('.load').mousedown(function() {


            $('.square').css('background-color', 'transparent');
            clearTimeout(timer_id);
            moving = false;
            load_game_number = $(this).html();
            current_game = save_game[load_game_number].slice();
            moveSquare();
        });
    });
*/
}

//create the sliders for red, green, blue, and alpha
function createRGBA() {

// RED
    for (var r = 1; r < 256; r ++) {
        var redSwatch = "<div class='reds'>"+r+"</div>";
        redness = "rgba(" + r + ", 0, 0, 1)";
        $(redSwatch).appendTo('.redPicker').css("background-color", redness);
    }

// GREEN
    for (var g = 1; g < 256; g ++) {
        var greenSwatch = "<div class='greens'>"+g+"</div>";
        greenness = "rgba( 0, " + g + ", 0, 1)";
        $(greenSwatch).appendTo('.greenPicker').css("background-color", greenness);
    }

//BLUE
    for (var b = 1; b < 256; b ++) {
        var blueSwatch = "<div class='blues'>"+b+"</div>";
        blueness = "rgba( 0, 0," + b + ",1)";
        $(blueSwatch).appendTo('.bluePicker').css("background-color", blueness);
    }


//ALPHA

    for (var a = 0; a < 250;  a ++) {
        var alphaSwatch = "<div class='alphas'>"+ (a / 250.0) +"</div>";
        alphaness = "rgba( 255, 255, 255, " + (a / 250.0) + ")";
        $(alphaSwatch).appendTo('.alphaPicker').css("background-color", alphaness);
    }

    $('.red_val').html("135");
    $('.green_val').html("206");
    $('.blue_val').html("250");
    $('.alpha_val').html("" + 250 / 250.0);

    $('.redSlider').css("left", 135);
    $('.greenSlider').css("left", 206);
    $('.blueSlider').css("left", 250);
    $('.alphaSlider').css("left", 250);
}

//create the color palette
function createColorPicker() {
    var swatch = "<div class='colors'></div>";
    newColor = "rgba(" + $('.red_val').html() + "," + $('.green_val').html() + "," + $('.blue_val').html() + "," + $('.alpha_val').html() +")";
    $('.currentColor').css("background-color", newColor);

    palette_color = "rgb(" + $('.red_val').html() + "," + $('.green_val').html() + "," + $('.blue_val').html() +")";
    $('.currentColor').unbind().mouseenter(function() {
        $(this).unbind().mousedown(function () {
            $(swatch).appendTo('.colorPicker').css("background-color", palette_color).html("<div><p>" + $('.red_val').html() + "</p><p>" + $('.green_val').html() + "</p><p>" + $('.blue_val').html() + "</p><p>" + $('.alpha_val').html() + "</p>");
        });
    });
}

// CHOOSE COLORS FUNCTIONS
function chooseColor() {

/*    // Eye Dropper using command key... how to turn it off?
    $(document).mouseover(function() {
        $(this).unbind("keydown").keydown(function(event) {
            last_key_pressed = event.keyCode;
            key_down = true;
            $('.stats > span:nth-child(2)').html(key_down);
            $('.stats > span:nth-child(3)').html(last_key_pressed);

            if (key_down == true && last_key_pressed == "224") {
                $('.grid').unbind('mouseover').mouseover(function() {
                    $('.square').unbind('mousedown').mousedown(function () {
                        eye_drop_color = $(this).css('background-color');
                        $('header>p').html(eye_drop_color);
                        setCurrentColor(eye_drop_color);
                    });
                });
            }
            $(this).unbind("keyup").keyup(function() {
                key_down = false;
                last_key_pressed = "1";
                $('.stats > span:nth-child(2)').html(key_down);
                $('.stats > span:nth-child(3)').html(last_key_pressed);
            });
        });
    });

*/

    $('.colorPicker').unbind('mouseover').mouseover(function() {
        $('.colors').unbind('mousedown').mousedown(function () {
            color = $(this).css('background-color');
            $('header>p').html(color);

            setCurrentColor(color);
        });
    });


}

function setCurrentColor(re_color) {

    swatch_color = re_color.replace("rgb(", "");
    swatch_color = swatch_color.replace(")", "");
    swatch_array = swatch_color.split(", ");

    // set replacement color based off of swatch background-color
    replacement_color = "rgba(" + $('.red_val').html() + "," + $('.green_val').html() + "," + $('.blue_val').html() + "," + $('.alpha_val').html() +")";

    // set sliders to match replacement color, except opacity.
    $('.redSlider').css("left", parseInt(swatch_array[0], 10));
    $('.greenSlider').css("left", parseInt(swatch_array[1], 10));
    $('.blueSlider').css("left", parseInt(swatch_array[2], 10));

    // set color_vals to match swatch
    $('.red_val').html(parseInt(swatch_array[0], 10));
    $('.green_val').html(parseInt(swatch_array[1], 10));
    $('.blue_val').html(parseInt(swatch_array[2], 10));

    // set current color to replacement color
    $('.currentColor').css("background-color", replacement_color);

    createColorPicker();

}

// choose color via slider
function slider(picker, slider, color_val) {
    var $slider = slider;
    var $picker = picker;
    var $color_val = color_val;

    $picker.unbind("mouseenter").mouseenter(function () {
        $picker.unbind("mousedown").mousedown(function (event) {

            dragging = true;
            $('.stats > span:nth-child(2)').html("" + dragging);

            xcolor = event.pageX - $slider.width();
            xcolor = xcolor < 0 ? 0 : xcolor > 250 ? 250 : xcolor;

            if ($color_val === "alpha") {
                $slider.css("left", xcolor);
                $('.alpha_val').html("" + (xcolor / 250.0));
            }
            else {
                $slider.css("left", xcolor);
                $color_val.html("" + xcolor);
            }

            createColorPicker();

            $(window).unbind("mousemove").mousemove(function(event) {
                if(dragging) {
                    xcolor = event.pageX - $slider.width() - 2;
                    xcolor = xcolor < 0 ? 0 : xcolor > 250 ? 250 : xcolor;
                    if ($color_val === "alpha") {
                        $slider.css("left", xcolor);
                        $('.alpha_val').html("" + (xcolor / 250.0));
                    }
                    else {
                        $slider.css("left", xcolor);
                        $color_val.html("" + xcolor);
                    }
                    createColorPicker();
                }

            });
            $(window).unbind("mouseup").mouseup(function() {
                dragging = false;
            });
        });
    });
}









// save feature...
// copy array at time of save button press in such a way that the copy doesn't
// update with the original...

// animate pixels (bounding color and moving color)

//clear color palette / delete individual colors / save color palette

// layers

// clear grid OR FLOOD GRID WITH ONE COLOR!!

// check out HTML canvas and paper.js for other projects. This one should
// remain "pixel" based and only use jQuery and javascript... (no other libraries)
// why? for the experience building things with limited resources... working with what you have...