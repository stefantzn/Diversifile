function script(ticker)
    % Define the parameters
    apiKey = '6nU0rFnIDQIpf5GexPLwMQ__KHLVdlX1';
    % ticker = 'AAPL'; % Replace with your desired stock ticker
    multiplier = '1'; % Daily data
    timespan = 'day';
    endDate = datestr(datetime('today'), 'yyyy-mm-dd'); % Today's date
    startDate = datestr(datetime('today') - calmonths(6), 'yyyy-mm-dd'); % Date six months ago

    % Construct the API URL
    url = sprintf('https://api.polygon.io/v2/aggs/ticker/%s/range/%s/%s/%s/%s?apiKey=%s', ...
        ticker, multiplier, timespan, startDate, endDate, apiKey);

    % Fetch data from the API
    data = webread(url);

    % Check if data is available
    if isfield(data, 'results') && ~isempty(data.results)
        % Extract data
        results = data.results;
        dates = datetime([results.t] / 1000, 'ConvertFrom', 'posixtime');
        openPrices = [results.o]';
        closePrices = [results.c]';
        highPrices = [results.h]';
        lowPrices = [results.l]';

        % Extract current day's data
        currentDayOpen = openPrices(end);
        currentDayClose = closePrices(end);
        currentDayHigh = highPrices(end);
        currentDayLow = lowPrices(end);

        disp(['open[', num2str(currentDayOpen), ']']);
        disp(['close[', num2str(currentDayClose), ']']);
        disp(['high[', num2str(currentDayHigh), ']']);
        disp(['low[', num2str(currentDayLow), ']']);
        
        % Analyze for candlestick patterns
        [latestPattern, lastPatternIndex, patternType, successRate] = detectLatestPattern(openPrices, closePrices, highPrices, lowPrices, dates);
        
        % Call the custom plot function with pattern highlight
        plotCandlestick(dates, openPrices, highPrices, lowPrices, closePrices, ticker, latestPattern, lastPatternIndex, patternType, successRate);
    else
        disp('No data available for the given date range.');
    end

    function [latestPattern, lastPatternIndex, patternType, successRate] = detectLatestPattern(openPrices, closePrices, highPrices, lowPrices, dates)
        n = length(dates);
        latestPattern = '';
        lastPattern = '';
        lastPatternIndex = -1;
        patternType = 'neutral';
        successRate = '';

        % Check for patterns for all days
        for i = 3:n
            if i >= 3
                if isThreeBlackCrows(openPrices(i-2:i), closePrices(i-2:i), highPrices(i-2:i), lowPrices(i-2:i))
                    lastPattern = 'Three Black Crows';
                    lastPatternIndex = i;
                    patternType = 'bearish';
                    successRate = '79%';
                elseif isThreeWhiteSoldiers(openPrices(i-2:i), closePrices(i-2:i))
                    lastPattern = 'Three White Soldiers';
                    lastPatternIndex = i;
                    patternType = 'bullish';
                    successRate = '84%';
                end
            end
            if i >= 2
                if isEngulfing(openPrices(i-1:i), closePrices(i-1:i))
                    if closePrices(i) > openPrices(i)
                        lastPattern = 'Bullish Engulfing';
                        patternType = 'bullish';
                        successRate = '62%';
                    else
                        lastPattern = 'Bearish Engulfing';
                        patternType = 'bearish';
                        successRate = '82%';
                    end
                    lastPatternIndex = i;
                end
            end
            if isHammer(openPrices(i), closePrices(i), highPrices(i), lowPrices(i))
                lastPattern = 'Hammer';
                lastPatternIndex = i;
                patternType = 'bullish'; % Assuming hammer is bullish
                successRate = '60%';
            elseif isInvertedHammer(openPrices, closePrices, highPrices, lowPrices, i)
                lastPattern = 'Inverted Hammer';
                lastPatternIndex = i;
                patternType = 'bullish'; % Assuming inverted hammer is bullish
                successRate = '67%';
            end

            % Update latest pattern if the current index is the last day
            if i == n
                if lastPatternIndex == n
                    latestPattern = lastPattern;
                else
                    latestPattern = [lastPattern, ' detected on ', datestr(dates(lastPatternIndex))];
                end
            end
        end
    end

    function isPattern = isEngulfing(openPrices, closePrices)
        % Bullish Engulfing
        if (closePrices(2) > openPrices(2)) && (closePrices(1) < openPrices(1)) && ...
        (closePrices(2) > openPrices(1)) && (openPrices(2) < closePrices(1))
            isPattern = true;
        % Bearish Engulfing
        elseif (closePrices(2) < openPrices(2)) && (closePrices(1) > openPrices(1)) && ...
            (closePrices(2) < openPrices(1)) && (openPrices(2) > closePrices(1))
            isPattern = true;
        else
            isPattern = false;
        end
    end

    function isPattern = isHammer(openPrice, closePrice, highPrice, lowPrice)
        % Detects a hammer pattern
        body = abs(closePrice - openPrice);
        lowerWick = min(openPrice, closePrice) - lowPrice;
        upperWick = highPrice - max(openPrice, closePrice);
        
        if (body < lowerWick) && (upperWick < 0.1 * body)
            isPattern = true;
        else
            isPattern = false;
        end
    end

    function isPattern = isInvertedHammer(openPrices, closePrices, highPrices, lowPrices, idx)
        % Detects an inverted hammer pattern at index `idx`
        body = abs(closePrices(idx) - openPrices(idx));
        lowerWick = min(openPrices(idx), closePrices(idx)) - lowPrices(idx);
        upperWick = highPrices(idx) - max(openPrices(idx), closePrices(idx));
        
        % Check if the inverted hammer is followed by an uptrend or appears at the end of a downtrend
        if (upperWick > 2 * body) && (lowerWick < 0.1 * body)
            % Confirm the context: look for a prior downtrend or pullback
            if idx > 2
                % Check the prior trend (downtrend or pullback)
                priorDowntrend = closePrices(idx-2) > closePrices(idx-1) && closePrices(idx-1) > closePrices(idx);
                priorPullback = closePrices(idx-2) < closePrices(idx-1) && closePrices(idx-1) > closePrices(idx);
                
                if priorDowntrend || priorPullback
                    isPattern = true;
                    return;
                end
            end
        end
        isPattern = false;
    end

    function isPattern = isThreeBlackCrows(openPrices, closePrices, highPrices, lowPrices)
        % Detects the three black crows pattern
        isPattern = true;
        
        for i = 1:3
            body = abs(closePrices(i) - openPrices(i));
            upperWick = highPrices(i) - max(openPrices(i), closePrices(i));
            lowerWick = min(openPrices(i), closePrices(i)) - lowPrices(i);
            
            % Check for bearish candle with significant body and small wicks
            if ~(closePrices(i) < openPrices(i) && (upperWick < 0.1 * body) && (lowerWick < 0.1 * body))
                isPattern = false;
                break;
            end
        end
    end

    function isPattern = isThreeWhiteSoldiers(openPrices, closePrices)
        % Detects the three white soldiers pattern
        if all(diff(openPrices) > 0) && all(diff(closePrices) > 0) && ...
        all(closePrices(1:end-1) < openPrices(2:end))
            isPattern = true;
        else
            isPattern = false;
        end
    end

    function plotCandlestick(dates, openPrices, highPrices, lowPrices, closePrices, symbol, latestPattern, lastPatternIndex, patternType, successRate)
        % Function to plot candlestick chart
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
            rectangle('Position', [i - 0.25, min(openPrices(i), closePrices(i)), 0.5, abs(closePrices(i) - openPrices(i))], ...
                    'FaceColor', color, 'EdgeColor', color);
        end
        
        % Highlight the latest pattern with a circle
        if lastPatternIndex > 0
            % Choose circle color based on pattern type
            if strcmp(patternType, 'bullish')
                circleColor = [0, 0.9, 0]; % Green
            else
                circleColor = [0.9, 0, 0]; % Red
            end
            
            % Draw a circle around the latest pattern
            plot(lastPatternIndex, (highPrices(lastPatternIndex) + lowPrices(lastPatternIndex)) / 2, 'o', ...
                'MarkerEdgeColor', circleColor, 'MarkerSize', 10, 'LineWidth', 2);
        end
        
        % Highlight the latest pattern with a legend
        if ~isempty(latestPattern)
            % Add success rate to legend
            legendText = sprintf('%s\nSuccess Rate: %s', latestPattern, successRate);
            legend(legendText, 'Location', 'northwest');
        end
        
        % Format the x-axis to reduce clutter
        ax = gca;
        xticks = 1:floor(length(dates)/18):length(dates);
        ax.XTick = xticks;
        ax.XTickLabel = datestr(dates(xticks), 'mm-dd');
        ax.XTickLabelRotation = 45;
        
        % Add labels and title with year
        xlabel(['Date (', datestr(dates(1), 'yyyy'), ')']);
        ylabel('Price ($)');
        title(['Candlestick Chart for ', symbol]);
        grid on;
        hold off;

        saveas(gcf, "plot.png");
    end
end