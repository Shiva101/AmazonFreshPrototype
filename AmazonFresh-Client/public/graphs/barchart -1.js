 $(document).ready(function () {
    
    $(".ShowRevenuePerWeek").on("click", function () {
    $('#chart1').empty();   // reload the chart
    var d = $("#revenueDate").text();
    alert(d);
    var param = { date: "2008-08-10",
                  days: 7}
    $.getJSON("\ testGraph",  param, function(res){
        
    //    var s1 = res.s1;
    
    var r1 = [['2016-03-10 1:00PM', 898], ['2016-03-11 1:00PM', 2222], ['2016-03-12 1:00PM', 1904], 
              ['2016-03-13 1:00PM', 1621],  ['2016-03-14 1:00PM', 1651],  ['2016-03-15 1:00PM', 1732], 
              ['2016-03-16 1:00PM', 1673]];
    
    var r2 = [['2008-08-10', 112], ['2008-08-11', 122], ['2008-08-12', 104], 
              ['2008-08-13', 121],  ['2008-08-14', 161],  ['2008-08-15', 173], ['2008-08-16', 173]];

 
    plot1 = $.jqplot("chart1", [r1, r1], {
        // Turns on animatino for all series in this plot.
        animate: true,
        // Will animate plot on calls to plot1.replot({resetAxes:true})
        title : "Weekely Revenue Chart",
        animateReplot: true,
        cursor: {
            show: true,
            zoom: true,
            looseZoom: true,
            showTooltip: false
        },
        series:[
            {
                pointLabels: {
                    show: true
                },
                renderer: $.jqplot.BarRenderer,
                showHighlight: false,
                yaxis: 'y2axis',
                rendererOptions: {
                    // Speed up the animation a little bit.
                    // This is a number of milliseconds.  
                    // Default for bar series is 3000.  
                    animation: {
                        speed: 2500
                    },
                    barWidth: 15,
                    barPadding: -15,
                    barMargin: 0,
                    highlightMouseOver: false
                }
            }, 
            {
                rendererOptions: {
                    // speed up the animation a little bit.
                    // This is a number of milliseconds.
                    // Default for a line series is 2500.
                    animation: {
                        speed: 2000
                    }
                }
            }
        ],
        axesDefaults: {
            pad: 0
        },
        axes: {
            // These options will set up the x axis like a category axis.
            xaxis: {
                label: "Date",
                tickInterval: "1 day",
                drawMajorGridlines: false,
                drawMinorGridlines: true,
                drawMajorTickMarks: false,
                renderer:$.jqplot.DateAxisRenderer,
                tickOptions:{ 
                    fontSize:'10pt', 
                    fontFamily:'Tahoma', 
                    angle:-40
                }
                //rendererOptions: {
                //tickInset: 0.5,
                //minorTicks: 1
                //}
            },
            yaxis: {
                label: "Revenue in $",
                tickOptions: {
                    formatString: "$%'d"
                },
                rendererOptions: {
                    forceTickAt0: true
                }
            },
            y2axis: {
                tickOptions: {
                    formatString: "$%'d"
                },
                rendererOptions: {
                    // align the ticks on the y2 axis with the y axis.
                    alignTicks: true,
                    forceTickAt0: true
                }
            }
        },
        highlighter: {
            show: true, 
            showLabel: true, 
            tooltipAxes: 'y',
            sizeAdjust: 7.5 , tooltipLocation : 'ne'
        }
    });
    });
    });

//////////////***************      Start showRidesPerArea ***************///////////////////////////
        
        $(".getStatesAndGenerateGraph").on("click", function () {
        $('#chart2').empty();       // reload the chart
        i=0;
        var ticks =[];
        $('.states_checkbox:checked').each(function () {
           ticks[i++] = "'"+$(this).val()+"'";
       });
        alert(ticks);
        var s1 = [2, 6, 7, 10, 12 ];
//        var ticks = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd', 'a', 'b', 'c', 'd', 'a', 'b'];
         
        plot2 = $.jqplot('chart2', [s1], {
            title : "Total Rides Per Area",
            animateReplot: true,
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
            axes: {
                xaxis: {
                    label: "States",
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                },
                yaxis: {
                label: "Total Rides"

            }}
        });
     /*
        $('#chart2').bind('jqplotDataHighlight', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info2').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data[1]);
            }
        );
             
        $('#chart2').bind('jqplotDataUnhighlight', 
            function (ev) {
                $('#info2').html('Nothing');
            }
        );*/
    });

//////////////***************      end  showRidesPerArea ***************///////////////////////////
//////////////***************      Start showRidesPerDriver ***************///////////////////////////
        
        $(".getDriverMonthAndGenerateGraph").on("click", function () {
        $('#chart3').empty();       // reload the chart
        i=0;
        var ticks =[];
        $('.Driver_month_checkbox:checked').each(function () {
           ticks[i++] = "'"+$(this).val()+"'";
       });
        alert(ticks);
        var s1 = [2, 6, 7, 10, 12 ];
//        var ticks = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd', 'a', 'b', 'c', 'd', 'a', 'b'];
         
        plot2 = $.jqplot('chart3', [s1], {
            title : "Total Rides Per Driver",
            animateReplot: true,
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
            axes: {
                xaxis: {
                    label: "Month",
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                },
                yaxis: {
                label: "Total Rides"

            }}
        });
     
        $('#chart3').bind('jqplotDataHighlight', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info3').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data[1]);
            }
        );
             /*
        $('#chart2').bind('jqplotDataUnhighlight', 
            function (ev) {
                $('#info3').html('Nothing');
            }
        );*/
    });

//////////////***************      end  showRidesPerDriver ***************///////////////////////////
//////////////***************      Start showRidesPerCustomer ***************///////////////////////////
        
        $(".getCustomerMonthAndGenerateGraph").on("click", function () {
        $('#chart4').empty();       // reload the chart
        i=0;
        var ticks =[];
        $('.Customer_month_checkbox:checked').each(function () {
           ticks[i++] = "'"+$(this).val()+"'";
       });
        alert(ticks);
        var s1 = [2, 12, 6, 9, 1 ];
//        var ticks = ['a', 'b', 'c', 'd', 'a', 'b', 'c', 'd', 'a', 'b', 'c', 'd', 'a', 'b'];
         
        plot2 = $.jqplot('chart4', [s1], {
            title : "Total Rides Per Customer",
            animateReplot: true,
            seriesDefaults: {
                renderer:$.jqplot.BarRenderer,
                pointLabels: { show: true }
            },
            axes: {
                xaxis: {
                    label: "Month",
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: ticks
                },
                yaxis: {
                label: "Total Rides"

            }}
        });
     
        $('#chart4').bind('jqplotDataHighlight', 
            function (ev, seriesIndex, pointIndex, data) {
                $('#info4').html('series: '+seriesIndex+', point: '+pointIndex+', data: '+data[1]);
            }
        );
             /*
        $('#chart2').bind('jqplotDataUnhighlight', 
            function (ev) {
                $('#info4').html('Nothing');
            }
        );*/
    });

//////////////***************      end  showRidesPerCustomer ***************///////////////////////////

});