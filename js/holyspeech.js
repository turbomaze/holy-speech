/******************\
|    Holy Speech   |
| @author Anthony  |
| @version 0.1     |
| @date 2015/03/22 |
| @edit 2015/03/22 |
\******************/

var HolySpeech = (function() {
    /**********
     * config */
    var PCT_CONSIDERED_EMPTY = 0.01;
    var ROUNDS_TO_EMPTY = 100;
    var replChar = '_';

    /*************
     * constants */
    var k = Math.log(PCT_CONSIDERED_EMPTY)/ROUNDS_TO_EMPTY;
    var sparsityFunc = function(x) {
        return Math.pow(Math.E, k*x);
    };

    /*********************
     * working variables */
    var speech = [];
    var speechJSON = '';
    var round = 0;

    /******************
     * work functions */
    function initHolySpeech() {
        $s('#add-pg-btn').addEventListener('click', function() {
            var descr = $s('#phrase-descr').value;
            var pgraph = $s('#paragraph').value;
            speech.push([descr, pgraph]);
            speechJSON = JSON.stringify(speech);
            $s('#json-output').value = speechJSON;

            renderSpeech(speech);

            $s('#phrase-descr').value = '';
            $s('#paragraph').value = '';

            return false;
        });

        $s('#load-speech-btn').addEventListener('click', function() {
            speech = JSON.parse($s('#json-output').value);
            renderSpeech(speech);

            return false;
        });

        $s('#swiss-btn').addEventListener('click', function() {
            round += 1;

            //render it
            renderSpeech(punchHolesInSpeech(speech));

            return false;
        });

        $s('#cheese-btn').addEventListener('click', function() {
            //render it
            renderSpeech(punchHolesInSpeech(speech));

            return false;
        });
    }

    function punchHolesInSpeech(spch) {
        //remove the words paragraph by paragraph
        var prbOfBlank = 1 - sparsityFunc(round);
        var speechWithHoles = [];
        for (var ai = 0; ai < spch.length; ai++) {
            speechWithHoles.push([
                spch[ai][0],
                bless(spch[ai][1], prbOfBlank)
            ]);
        }
        return speechWithHoles;
    }

    function bless(pgr, holiness) {
        function whiteOutAndUnderline(word) {
            return '<span style='+
                        '"border-bottom: 2px solid black; color: white;">'+
                word +
            '</span>';
        }

        var words = pgr.split(' ');
        var newWords = [];
        for (var ai = 0; ai < words.length; ai++) {
            if (words[ai] === '*') {
                newWords.push('<span style="color: red;"><b>*</b></span>');
            } else {
                if (Math.random() < holiness) { //remove this word
                    newWords.push(whiteOutAndUnderline(words[ai]));
                } else {
                    newWords.push(words[ai]);
                }
            }
        }
        return newWords.join(' ');
    }

    function renderSpeech(spch) {
        $s('#chunk-container').innerHTML = '';
        for (var ai = 0; ai < spch.length; ai++) {
            var chunk = document.createElement('div');
            chunk.className = 'chunk';
            var leftCol = document.createElement('div');
            leftCol.className = 'column-l unit one-of-three';
            leftCol.innerHTML = spch[ai][0];
            var rightCol = document.createElement('div');
            rightCol.className = 'column-r unit two-of-three';
            var ul = document.createElement('ul');
            var li = document.createElement('li');
            li.innerHTML = spch[ai][1];
            ul.appendChild(li);
            rightCol.appendChild(ul);
            chunk.appendChild(leftCol);
            chunk.appendChild(rightCol);
            $s('#chunk-container').appendChild(chunk);
        }
    }

    /***********
     * objects */

    /********************
     * helper functions */
    function $s(id) { //for convenience
        if (id.charAt(0) !== '#') return false;
        return document.getElementById(id.substring(1));
    }

    return {
        init: initHolySpeech
    };
})();


window.addEventListener('load', function() {
    HolySpeech.init();
}); 