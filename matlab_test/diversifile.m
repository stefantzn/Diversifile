% x = 3:10
% y = sqrt(x)
% disp('HEY THERE');
% 
% t = 2:5
% 
% plot(x, y)
% saveas(gcf, 'public/plot.png');

function script(inputArg)
    % Log the input argument
    disp(['Input argument: ', inputArg]);

    % Define data
    x = 3:10;
    y = sqrt(x);

    % Create a plot
    plot(x, y);

    % Define the output directory and file name
    outputDir = fullfile(pwd, 'public');  % Use full path for the public directory
    outputFile = fullfile(outputDir, 'plot.png');

    % Check if the directory exists, create it if it doesn't
    if ~exist(outputDir, 'dir')
        mkdir(outputDir);
    end

    % Save the plot as an image
    saveas(gcf, outputFile);
end