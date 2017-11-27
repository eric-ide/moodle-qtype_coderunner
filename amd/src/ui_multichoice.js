// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * JavaScript for implementing multichoice input for student answers.
 * This is just a demo ui plugin.
 *
 * @package    qtype
 * @subpackage coderunner
 * @copyright  Emily Price, Richard Lobb, 2017, The University of Canterbury
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


define(['jquery'], function($) {

    function MultichoiceInterface() { // Constructor for multichoice interface.
        var t = this;

        this.activeInstances = [];  // Map from taId to GUI div
        $(document.body).on('keydown', function(e) {
            var KEY_M = 77, buttonClicker, textarea;

            if (e.keyCode === KEY_M && e.ctrlKey && e.altKey) {
                for (var taId in t.activeInstances) {
                    buttonClicker = t.activeInstances[taId];
                    textarea = document.getElementById(taId);
                    $(buttonClicker).toggle();
                    $(textarea).toggle();
                }
            }
        });
    }

    MultichoiceInterface.prototype.init = function (taId) {
        var textArea = $(document.getElementById(taId)),
            options = [],
            buttonClicker = document.createElement("div"),
            jsonData = {};

        textArea.attr('readonly', 'readonly');
        this.activeInstances[taId] = buttonClicker;

        // First we load jsonData with whatever is in the textArea
        jsonData = window.JSON.parse(textArea.val());

        // Build the list of options based on the preloaded data
        for (var prop in jsonData) {
            options.push(prop);
        }

        // Create all the radio buttons
        options.forEach(function(option) {
            var radioOption = document.createElement("input"),
                optionLabel = document.createElement("label"),
                optionText;

            radioOption.setAttribute("type", "radio");
            radioOption.setAttribute("name", "multichoice");
            radioOption.setAttribute("id", option);
            if (jsonData[option]) {
                radioOption.setAttribute("checked", "checked");
            }
            radioOption.onclick = updateJson;
            optionLabel.style.display = "inline-block";

            /*create text node for label Text which display for Radio button*/
            optionText = document.createTextNode(option);

            /*add text to new create lable*/
            optionLabel.appendChild(radioOption);
            optionLabel.appendChild(optionText);

            /*add radio button to Div*/
            buttonClicker.appendChild(optionLabel);
            buttonClicker.appendChild(document.createElement("br"));
        });

        function updateJson() {
            var radios = document.getElementsByName("multichoice");
            radios.forEach(function(radio) {
                jsonData[radio.id] = radio.checked;
            });
            textArea.val(JSON.stringify(jsonData));
        }

        $(buttonClicker).insertBefore(textArea);
    };

    MultichoiceInterface.prototype.destroyInstance = function(taId) {
        var buttonClicker = this.activeInstances[taId];
        buttonClicker.parentNode.removeChild(buttonClicker); // Yuck, but remove() not well supported
        delete this.activeInstances[taId];
        $(document.getElementById(taId)).show();
    };

});
