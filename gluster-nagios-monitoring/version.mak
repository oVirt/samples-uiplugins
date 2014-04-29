# Version Information

PLUGIN_NAME=gluster-nagios-monitoring
PACKAGE_NAME=gluster-nagios-monitoring

# Actual Version
VERSION=0.1.0

# Milestone is manually specified,
# example for ordering:
# - master
# - alpha
# - master
# - beta
# - master
# - beta2
# - master
# - rc
# - master
# - rc2
# - master
# - <none>
#
MILESTONE=master

# RPM release is manually specified,
# For pre-release:
# RPM_RELEASE=0.N.$(MILESTONE).$(shell date -u +%Y%m%d%H%M%S)
# While N is incremented when milestone is changed.
#
# For release:
# RPM_RELEASE=N
# while N is incremented each re-release
#
PACKAGE_RPM_RELEASE=1.0.$(MILESTONE).$(shell date -u +%Y%m%d%H%M)

#
# Do not touch
#
ifneq ($(MILESTONE),)
SUFFIX:=_$(MILESTONE)
endif
PACKAGE_VERSION=$(VERSION)$(SUFFIX)
PACKAGE_RPM_VERSION=$(VERSION)
