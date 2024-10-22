import React, { useState } from 'react';

const BotCommandInput = () => {
  // Available bots and commands
  const bots = ['chart', 'file', 'customfield'];
  const botCommands = {
    chart: ['load-chart', 'add-chart'],
    file: ['load-file', 'upload-file'],
    customfield: ['custom1', 'custom2'],
  };

  // Dynamic options for each bot-command pair (if needed)
  const dynamicOptions = {
    chart: ['chart1', 'chart2', 'chart3'], // Dynamic options for chart commands
    file: ['file1', 'file2', 'file3'], // Dynamic options for file commands
  };

  const [input, setInput] = useState(''); // Track user input
  const [suggestions, setSuggestions] = useState([]); // Suggestions for bots/commands
  const [selectedBot, setSelectedBot] = useState(null); // Selected bot
  const [selectedCommand, setSelectedCommand] = useState(null); // Selected command
  const [popupVisible, setPopupVisible] = useState(false); // Show dynamic options popup
  const [selectedOptions, setSelectedOptions] = useState([]); // Array for selected options (chart/file)
  const [error, setError] = useState(''); // Validation error
  const [loading, setLoading] = useState(false); // Loading state for submit

  // Handle input change and trigger suggestions
  const handleInputChange = (e) => {
    const value = e.target.textContent; // Get content from the editable div
    setInput(value);
    setError(''); // Clear previous errors

    // Reset all states if input is cleared
    if (value === '') {
      setSelectedBot(null);
      setSelectedCommand(null);
      setSelectedOptions([]);
      setPopupVisible(false);
      setSuggestions([]);
      return;
    }

    // Show bot suggestions when '@' is typed and no bot is selected
    if (value.includes('@') && !selectedBot) {
      const botSearch = value.split('@').pop();
      const botSuggestions = bots.filter((bot) =>
        bot.startsWith(botSearch)
      );
      setSuggestions(botSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions if input doesn't include '@'
    }
  };

  // Handle bot selection
  const handleBotSelect = (bot) => {
    setSelectedBot(bot);
    setSuggestions([]);
    setInput(`@${bot} /`); // Prepend bot to input
  };

  // Handle command suggestion after bot selection
  const handleCommandSelect = (command) => {
    setSelectedCommand(command);
    setInput(`@${selectedBot} /${command} `); // Prepend command to input

    // Check if the selected bot has dynamic options
    if (dynamicOptions[selectedBot]) {
      setPopupVisible(true); // Show dynamic options popup if available
    } else {
      setPopupVisible(false); // No popup needed, so allow submit
    }
  };

  // Handle dynamic option selection (e.g., chart or file)
  const handleOptionSelect = (option) => {
    // Append the selected option to the existing array of selected options
    setSelectedOptions((prevOptions) => [...prevOptions, option]);
    setPopupVisible(true); // Keep popup visible for multiple selections
    setInput((prev) => `${prev}{${option}} `); // Append option (chart/file) to input
  };

  // Allow option removal by clicking on it
  const handleOptionRemove = (optionToRemove) => {
    setSelectedOptions((prevOptions) =>
      prevOptions.filter((option) => option !== optionToRemove)
    );
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!input.startsWith('@') || !selectedBot || !selectedCommand) {
      setError('Please complete the command by selecting a bot and a command.');
      return;
    }

    if (popupVisible && selectedOptions.length === 0) {
      setError('Please select at least one option.');
      return;
    }

    // Send command to the backend
    try {
      setLoading(true);
      const response = await fetch('https://your-backend-api.com/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: input.trim(),
          options: selectedOptions, // Send the selected options
        }),
      });

      if (response.ok) {
        console.log('Command sent successfully');
        // Reset to default state after successful submission
        setInput(''); // Clear input
        setSelectedBot(null);
        setSelectedCommand(null);
        setSelectedOptions([]);
      } else {
        setError('Failed to send command. Please try again.');
      }
    } catch (err) {
      setError('Error sending the command. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Render formatted input text with multiple options
  const renderFormattedInput = () => {
    const botPart = selectedBot ? `@${selectedBot}` : '';
    const commandPart = selectedCommand ? ` /${selectedCommand}` : '';
    const optionPart = selectedOptions.map((option) => (
      <span
        key={option}
        className="text-red-500 cursor-pointer"
        onClick={() => handleOptionRemove(option)}
      >
        {' '}
        {`{${option}}`}
      </span>
    ));

    return (
      <>
        <span className="text-blue-500">{botPart}</span>
        <span className="text-green-500">{commandPart}</span>
        {optionPart}
      </>
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative">
          <div
            contentEditable
            onInput={handleInputChange}
            placeholder="Type '@' to trigger bots"
            className="w-full p-2 border border-gray-300 rounded min-h-[40px]"
          >
            {renderFormattedInput()}
          </div>
          {/* Show bot suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border mt-1 w-full z-10">
              {suggestions.map((bot) => (
                <li
                  key={bot}
                  onClick={() => handleBotSelect(bot)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {bot}
                </li>
              ))}
            </ul>
          )}

          {/* Show command suggestions */}
          {selectedBot && !selectedCommand && (
            <ul className="absolute bg-white border mt-1 w-full z-10">
              {botCommands[selectedBot].map((command) => (
                <li
                  key={command}
                  onClick={() => handleCommandSelect(command)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {command}
                </li>
              ))}
            </ul>
          )}

          {/* Dynamic options (for chart, file, etc.) */}
          {popupVisible && dynamicOptions[selectedBot] && (
            <div className="absolute bg-white border p-2 w-full mt-1 z-20">
              <p>Select an option:</p>
              {dynamicOptions[selectedBot].map((option) => (
                <div
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? 'Submitting...' : 'Submit Command'}
        </button>

        {/* Error feedback */}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default BotCommandInput;
