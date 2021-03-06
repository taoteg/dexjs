module.exports = function (dex) {

  return function (userConfig, defaultConfig) {
    userConfig = userConfig || {};
    defaultConfig = defaultConfig || {};

    this.debug = false;

    // Allows component construction from other components.
    if (userConfig.hasOwnProperty('config')) {
      this.config = dex.config.expandAndOverlay(userConfig.config, defaultConfig);
    }
    // Else, we have a configuration.
    else {
      this.config = dex.config.expandAndOverlay(userConfig, defaultConfig);
    }

    dex.console.debug("dex.component Configuration", this.config);

    if (!this.config.channel) {
      this.config.channel = (this.config.parent || "#parent") + "/" +
        (this.config.id || "unknown-id");
    }

    this.attr = function (name, value) {
      if (arguments.length == 0) {
        return this.config;
      }
      else if (arguments.length == 1) {
        // REM: Need to getHierarchical
        return this.config[name];
      }
      else if (arguments.length == 2) {
        //console.log("Setting Hieararchical: " + name + "=" + value);
        //console.dir(this.config);

        // This will handle the setting of a single attribute
        dex.object.setHierarchical(this.config, name, value, '.');
      }
      return this;
    };

    this.subscribe = function (source, eventType, callback) {
      if (arguments.length == 3) {
        var channel = source.config.channel + '/' + eventType;

        dex.console.log("subscribe to " + channel);
        if (arguments.length < 3) {
          dex.console.log("failed");
          return false;
        }
        return dex.bus.subscribe(channel, callback);
      }
      else {
        return false;
      }
    };

    /**
     *
     * Unsubscribe this component.
     *
     * @method dex.component.unsubscribe
     *
     * @param handle - The handle attained via subscribe.
     *
     */
    this.unsubscribe = function (handle) {
      dex.bus.unsubscribe(handle);
      return this;
    };

    /**
     *
     * Publish an event to the component's subscribers.
     *
     * @method dex.component.publish
     *
     * @param event - The event to publish.  An event can be any object, however,
     * it must define a property named "type".
     * @param event.type - The type of the event we are publishing.
     *
     */
    this.publish = function (event) {
      var channel;

      if (!event || !event.type) {
        dex.console.warn("publish of event to " + this.channel + " failed.");
        dex.bus.publish("error", {
          type: "error",
          "description": "Error publishing event: '" + event + "' to '" + this.channel + "'"
        });
      }
      else {
        channel = this.config.channel + '/' + event.type;
        dex.console.log("publish to " + channel);
        dex.bus.publish(channel, event);
      }
      return this;
    };

    /**
     *
     * A default no-op implementation of render.  Subclasses should
     * override this method with one which provides an initial rendering
     * of their specific component.  This is a great place to put
     * one-time only initialization logic.
     *
     * @method dex.component.render
     *
     */
    this.render = function () {
      console.log("Unimplemented routine: render()");
      return this;
    };

    /**
     *
     * A default no-op implementation of update.  This will update the
     * current component relative to any new setting or data changes.
     *
     * @method dex.component.update
     *
     */
    this.update = function () {
      console.log("Unimplemented routine: update()");
      return this;
    };

    // Generic routine for resizing a chart instance.
    this.resize = function (chart) {
      return function () {
        if (chart.config && chart.config.resizable) {
          var width = d3.select(chart.config.parent).property("clientWidth");
          var height = d3.select(chart.config.parent).property("clientHeight");

          dex.console.debug("Resizing: " + chart.config.parent + ">" + chart.config.id +
            "." + chart.config.class + " to (" +
            width + "w x " + height + "h)");

          if (!_.isNumber(height)) {
            height = "100%";
          }

          if (!_.isNumber(width)) {
            width = "100%";
          }

          return chart.attr("width", width)
            .attr("height", height)
            .update();
        }
        else {
          return chart.update();
        }
      };
    };

    // Used for external entities to configure the chart.
    this.configure = function (config) {
      dex.console.log("Configuration", "new", config, "current", this.config);
      this.config = dex.config.expandAndOverlay(config, this.config);
      dex.console.log("New Configuration", this.config);
      return this;
    };

    // Used to load chart state from the DOM.
    this.load = function (location) {
      var config = {};

      $(location + " div").each(function (i) {
        dex.console.log("Loading Setting: '" + $(this).attr('id') + "'='" +
          $(this).attr('value') + "'");
        config[$(this).attr('id')] = $(this).attr('value');
      });

      dex.console.debug("Loaded Configuration:", config);
      return this.configure(config);
    };

    // Used to save chart state within the DOM.
    this.save = function (location, config) {
      dex.console.log("Saving Configuration To: " + location, config);
      $(location).children().remove();
      _.keys(config).forEach(function (key) {
        $(location).append("<div id='" + key + "' value='" + config[key] + "'></div>");
      });
      return this;
    };

    this.resize = this.resize(this);

    if (window.attachEvent) {
      dex.console.debug("window.attachEvent");
      window.attachEvent('onresize', this.resize);
    }
    else if (window.addEventListener) {
      dex.console.debug("window.addEventListener");
      window.addEventListener('resize', this.resize, true);
    }
    else {
      dex.console.log("window does not support event binding");
    }

    return this;
  };
};