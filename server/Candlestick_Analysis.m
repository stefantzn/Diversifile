% Define your Alpha Vantage API key
apiKey = '2SE5J5LNDFZBAW4L';  % Replace with your actual API key

% Define the stock symbol and function for daily time series data
symbol = 'AAPL';

disp('Downloading daily time series data from Alpha Vantage...');


% Construct the API URL for full daily time series
url = ['https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=', ...
       symbol, ...
       '&apikey=', apiKey, '&datatype=csv'];

% Fetch the data using webread
opts = weboptions('Timeout', 30, 'ContentType', 'text'); % Set content type to text
dataStr = webread(url, opts);

% Split the data string into lines
lines = strsplit(dataStr, '\n');

% Use textscan to read the data from the string
formatSpec = '%s%f%f%f%f%f';
dataCell = textscan(strjoin(lines(2:end), '\n'), formatSpec, 'Delimiter', ',', 'HeaderLines', 0);

% Convert the cell array to a table
dataTable = table(datetime(dataCell{1}, 'InputFormat', 'yyyy-MM-dd'), ...
                  dataCell{2}, dataCell{3}, dataCell{4}, dataCell{5}, dataCell{6}, ...
                  'VariableNames', {'timestamp', 'open', 'high', 'low', 'close', 'volume'});

% Sort the data by date
dataTable = sortrows(dataTable, 'timestamp');

disp('Data downloaded successfully.');

% Define the date range for filtering (previous year to current date)
currentDate = datetime('today');
startDate = currentDate - calyears(1);

% Filter the data for the specified date range
filteredData = dataTable(dataTable.timestamp >= startDate & dataTable.timestamp <= currentDate, :);

% Display the processed and filtered data
disp(head(filteredData));

% Plot the candlestick chart
plotCandlestick(filteredData.timestamp, filteredData.open, filteredData.high, filteredData.low, filteredData.close);

disp('Candlestick chart generated successfully.');

% Custom function to plot candlesticks
function plotCandlestick(dates, openPrices, highPrices, lowPrices, closePrices)
    figure;
    hold on;
    
    % Loop through each data point to plot candlesticks
    for i = 1:length(dates)
        % Determine the color of the candlestick
        if closePrices(i) > openPrices(i)
            % Bullish candlestick (price went up)
            color = [0, 0.5, 0]; % Green
        else
            % Bearish candlestick (price went down)
            color = [0.5, 0, 0]; % Red
        end
        
        % Plot the high-low line
        plot([i, i], [lowPrices(i), highPrices(i)], 'Color', 'k', 'LineWidth', 1);
        
        % Plot the open-close rectangle
        rectangle('Position', [i-0.25, min(openPrices(i), closePrices(i)), 0.5, abs(closePrices(i) - openPrices(i))], ...
                  'FaceColor', color, 'EdgeColor', color);
    end
    
    % Format the x-axis
    ax = gca;
    ax.XTick = 1:length(dates);
    ax.XTickLabel = datestr(dates, 'mm-dd');
    ax.XTickLabelRotation = 45;
    
    % Add labels and title with year
    xlabel(['Date (', datestr(dates(1), 'yyyy'), ')']);
    ylabel('Price ($)');
    % title('Candlestick Chart for ', symbol);
    grid on;
    hold off;

    saveas(gcf, "plot.png");
end
