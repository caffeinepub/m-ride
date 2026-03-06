import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";

actor {
  type Ride = {
    id : Nat;
    name : Text;
    date : Text;
    distanceKm : Float;
    durationMinutes : Nat;
    notes : Text;
    rating : Nat;
  };

  type RideStats = {
    totalRides : Nat;
    totalDistanceKm : Float;
    totalDurationMinutes : Nat;
    avgDistanceKm : Float;
    longestRideKm : Float;
    longestRideName : Text;
  };

  module Ride {
    public func compareByDateDesc(a : Ride, b : Ride) : Order.Order {
      Text.compare(b.date, a.date);
    };
  };

  var nextId = 4;

  let rides = Map.fromIter<Nat, Ride>([
    (
      1,
      {
        id = 1;
        name = "Mountain Loop";
        date = "2023-08-15";
        distanceKm = 120.5;
        durationMinutes = 180;
        notes = "Scenic views, smooth ride.";
        rating = 5;
      },
    ),
    (
      2,
      {
        id = 2;
        name = "City Cruise";
        date = "2023-05-22";
        distanceKm = 45.3;
        durationMinutes = 75;
        notes = "Lots of traffic.";
        rating = 3;
      },
    ),
    (
      3,
      {
        id = 3;
        name = "Coastal Adventure";
        date = "2022-12-01";
        distanceKm = 200.0;
        durationMinutes = 300;
        notes = "Windy but beautiful.";
        rating = 4;
      },
    ),
  ].values());

  public shared ({ caller }) func createRide(name : Text, date : Text, distanceKm : Float, durationMinutes : Nat, notes : Text, rating : Nat) : async Ride {
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let newRide : Ride = {
      id = nextId;
      name;
      date;
      distanceKm;
      durationMinutes;
      notes;
      rating;
    };
    rides.add(nextId, newRide);
    nextId += 1;
    newRide;
  };

  public query ({ caller }) func getAllRides() : async [Ride] {
    rides.values().toArray().sort(Ride.compareByDateDesc);
  };

  public query ({ caller }) func getRide(id : Nat) : async Ride {
    switch (rides.get(id)) {
      case (null) { Runtime.trap("Ride not found") };
      case (?ride) { ride };
    };
  };

  public shared ({ caller }) func updateRide(id : Nat, name : Text, date : Text, distanceKm : Float, durationMinutes : Nat, notes : Text, rating : Nat) : async Ride {
    switch (rides.get(id)) {
      case (null) { Runtime.trap("Ride not found") };
      case (?_) {
        if (rating < 1 or rating > 5) {
          Runtime.trap("Rating must be between 1 and 5");
        };
        let updatedRide : Ride = {
          id;
          name;
          date;
          distanceKm;
          durationMinutes;
          notes;
          rating;
        };
        rides.add(id, updatedRide);
        updatedRide;
      };
    };
  };

  public shared ({ caller }) func deleteRide(id : Nat) : async () {
    if (not rides.containsKey(id)) {
      Runtime.trap("Ride not found");
    };
    rides.remove(id);
  };

  public query ({ caller }) func getStats() : async RideStats {
    let totalRides = rides.size();

    if (totalRides == 0) {
      return {
        totalRides = 0;
        totalDistanceKm = 0.0;
        totalDurationMinutes = 0;
        avgDistanceKm = 0.0;
        longestRideKm = 0.0;
        longestRideName = "";
      };
    };

    let rideArray = rides.values().toArray();

    var totalDistance = 0.0;
    var totalDuration = 0;
    var longestDistance = 0.0;
    var longestName = "";

    for (ride in rideArray.values()) {
      totalDistance += ride.distanceKm;
      totalDuration += ride.durationMinutes;
      if (ride.distanceKm > longestDistance) {
        longestDistance := ride.distanceKm;
        longestName := ride.name;
      };
    };

    {
      totalRides;
      totalDistanceKm = totalDistance;
      totalDurationMinutes = totalDuration;
      avgDistanceKm = totalDistance / totalRides.toFloat();
      longestRideKm = longestDistance;
      longestRideName = longestName;
    };
  };
};
