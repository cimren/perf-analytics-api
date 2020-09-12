CREATE TABLE perf_metrics (
  ID SERIAL PRIMARY KEY, 
  url VARCHAR(255) NOT NULL, 
  TTFB VARCHAR(255), 
  FCP VARCHAR(255), 
  domLoad VARCHAR(255), 
  windowLoad VARCHAR(255), 
  dateTime VARCHAR(255)
);

INSERT INTO perf_metrics (url, TTFB, FCP, domLoad, windowLoad, dateTime) 
VALUES ('example.com', '12', '54', '102', '140', '1209201450');