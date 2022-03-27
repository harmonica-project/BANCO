import $ from 'jquery';
import { featureFinder, featureGetter } from './feature';

export function Configuration(model, selectedFeatures, deselectedFeatures) {
    if (!(this instanceof Configuration))
        return new Configuration(model, selectedFeatures, deselectedFeatures);

    this.model = model;
    this.selectedFeatures = selectedFeatures || [];
    this.deselectedFeatures = deselectedFeatures || [];
    this.getSelectedFeature = featureGetter("selectedFeatures");
    this.getDeselectedFeature = featureGetter("deselectedFeatures");

    this.isDeactivated = function(feature) {
        return !!this.getDeactivatedFeatures().find(featureFinder(feature.name));
    };
    
    this.isActivated = function(feature) {
        return !!this.getActivatedFeatures().find(featureFinder(feature.name));
    };
    
    this.isEnabled = function(feature) {
        return this.getSelectedFeature(feature.name) || this.isActivated(feature);
    };
    
    this.isDisabled = function(feature) {
        return this.getDeselectedFeature(feature.name) || this.isDeactivated(feature);
    };
    
    this.isAutomatic = function(feature) {
        return this.isActivated(feature) || this.isDeactivated(feature);
    };
    
    this.isManual = function(feature) {
        return this.getSelectedFeature(feature.name) || this.getDeselectedFeature(feature.name);
    };

    this.isComplete = function() {
        var doneFeatures = this.selectedFeatures.concat(this.deselectedFeatures)
            .concat(this.getDeactivatedFeatures()).concat(this.getActivatedFeatures());
        var everyFeatureDone = this.model.features.reduce(function(acc, feature) {
            return acc && !!doneFeatures.find(featureFinder(feature.name));
        }, true);
        return this.isValid() && everyFeatureDone;
    };
    
    this.isValid = function() {
        var self = this;
        if (self._isValid === undefined)
            self._isValid = self.model.constraintSolver.isValid(self);
        return self._isValid;
    };
    
    this.getDeactivatedFeatures = function() {
        var self = this;
        if (self._deactivatedFeatures === undefined)
            self._deactivatedFeatures = self.model.features.filter(function(feature) {
                if (self._activatedFeatures && self._activatedFeatures.find(featureFinder(feature.name)))
                    return false; // performance optimization
                return self.model.constraintSolver.isDeactivated(self, feature);
            });
        return self._deactivatedFeatures;
    };
    
    this.getActivatedFeatures = function() {
        var self = this;
        if (self._activatedFeatures === undefined)
            self._activatedFeatures = self.model.features.filter(function(feature) {
                if (self._deactivatedFeatures && self._deactivatedFeatures.find(featureFinder(feature.name)))
                    return false;
                return self.model.constraintSolver.isActivated(self, feature);
            });
        return self._activatedFeatures;
    };
    
    this.serialize = function() {
        var self = this;
        if (!self.isComplete())
            throw new Error("Configuration is not complete");
        var xml = document.implementation.createDocument(null, "configuration");
    
        function setAttribute(node, key, value) {
            var attribute = document.createAttribute(key);
            attribute.value = value;
            node.attributes.setNamedItem(attribute);
        }
        
        self.model.features.forEach(function(feature) {
            var node = xml.createElement("feature");
            var manual = self.getSelectedFeature(feature.name) ? "selected" :
                self.getDeselectedFeature(feature.name) ? "unselected" :
                "undefined";
            setAttribute(node, "automatic",
                         manual === "undefined" && self.isActivated(feature) ? "selected" :
                         manual === "undefined" && self.isDeactivated(feature) ? "unselected" :
                         "undefined");
            setAttribute(node, "manual", manual);
            setAttribute(node, "name", feature.name);
            if (feature.hasValue)
                setAttribute(node, "value", feature.value);
            xml.children[0].appendChild(node);
        });
    
        return new XMLSerializer().serializeToString(xml);
    };
}

Configuration.fromXml = function(model, xml) {
    var selectedFeatures = [], deselectedFeatures = [];
    
    $(xml).find("feature").each(function() {
        var feature = model.getFeature($(this).attr("name")),
            value = $(this).attr("value");
        
        if ($(this).attr("manual") === "selected")
            selectedFeatures.push(feature);
        else if ($(this).attr("manual") === "unselected")
            deselectedFeatures.push(feature);
        
        if (typeof value !== typeof undefined)
            feature.setValue(value);
    });

    return new Configuration(model, selectedFeatures, deselectedFeatures);
};