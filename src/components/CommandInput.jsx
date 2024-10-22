import React, { useState } from 'react';

const CommandInput = () => {
  const bots = ['chart', 'file']; // Available bots
  const chartCommands = ['load-chart', 'add-chart']; // Commands for chart bot
  const fileCommands = ['upload-file', 'download-file']; // Commands for file bot

  const [input, setInput] = useState(''); // To track the user input
  const [suggestions, setSuggestions] = useState([]); // To track autocomplete suggestions
  const [selectedBot, setSelectedBot] = useState(null); // To track the selected bot
  const [selectedCommand, setSelectedCommand] = useState(''); // Track selected bot command
  const [error, setError] = useState(''); // To track errors
  const [loading, setLoading] = useState(false); // Loading state for sending request

  // Handle input change and provide suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setError(''); // Reset any previous error

    // If the input starts with '@', provide suggestions for bots
    if (value.startsWith('@') && !selectedBot) {
      const botSearch = value.slice(1).toLowerCase(); // Remove '@' and convert to lowercase
      const filteredBots = bots.filter((bot) => bot.startsWith(botSearch));
      setSuggestions(filteredBots);
    } 
    // If bot is selected and we're expecting a command
    else if (selectedBot && value.includes('/')) {
      const commandSearch = value.split('/')[1]?.toLowerCase();
      if (selectedBot === 'chart') {
        const filteredCommands = chartCommands.filter((cmd) =>
          cmd.startsWith(commandSearch)
        );
        setSuggestions(filteredCommands);
      } else if (selectedBot === 'file') {
        const filteredCommands = fileCommands.filter((cmd) =>
          cmd.startsWith(commandSearch)
        );
        setSuggestions(filteredCommands);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle bot selection from suggestions
  const handleBotSelect = (bot) => {
    setSelectedBot(bot); // Set the selected bot
    setInput(`@${bot} `); // Update input field
    setSuggestions([]); // Clear suggestions
  };

  // Handle command selection from suggestions
  const handleCommandSelect = (command) => {
    setSelectedCommand(command); // Set selected command
    setInput(`@${selectedBot} /${command}`); // Update input with command
    setSuggestions([]); // Clear suggestions
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: Ensure input is not empty and starts with '@'
    if (!input.startsWith('@') || input.trim().length === 1) {
      setError('Please enter a valid command starting with @.');
      return;
    }

    // Send request to the backend
    try {
      setLoading(true); // Show loading state
      const response = await fetch('https://your-backend-api.com/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: input.trim() }), // Send the full command
      });

      if (response.ok) {
        // Command sent successfully, handle success if needed
        console.log('Command sent successfully');
        setInput(''); // Clear input
        setSelectedBot(null); // Clear selected bot
        setSelectedCommand(''); // Clear selected command
      } else {
        setError('Failed to send command. Try again.');
      }
    } catch (error) {
      setError('Error sending the command. Please try again later.');
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type '@' followed by a bot and command"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() =>
                    selectedBot ? handleCommandSelect(item) : handleBotSelect(item)
                  }
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {selectedBot ? `/${item}` : `@${item}`}
                </li>
              ))}
            </ul>
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

export default CommandInput;
