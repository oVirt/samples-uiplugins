#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

include version.mak

RPMBUILD=rpmbuild
TARBALL=$(PACKAGE_NAME)-$(PACKAGE_VERSION)-$(PACKAGE_RPM_RELEASE).tar.gz

PREFIX=/usr/local
SYSCONF_DIR=$(PREFIX)/etc
BIN_DIR=$(PREFIX)/bin
DATAROOT_DIR=$(PREFIX)/share
MAN_DIR=$(DATAROOT_DIR)/man
PYTHON=python
PYTHON_SYS_DIR:=$(shell $(PYTHON) -c "from distutils.sysconfig import get_python_lib as f;print(f())")
PYTHON_DIR=$(PYTHON_SYS_DIR)
DATA_DIR=$(DATAROOT_DIR)/ovirt-engine
PLUGIN_ROOT_DIR=$(DATA_DIR)/ui-plugins
PLUGIN_DIR=$(PLUGIN_ROOT_DIR)/$(PLUGIN_NAME)

.SUFFIXES: .in
.PHONY: gluster-nagios-monitoring.spec.in

.in:
	sed \
	-e "s|@PACKAGE_NAME@|$(PACKAGE_NAME)|g" \
	-e "s|@PACKAGE_VERSION@|$(PACKAGE_VERSION)|g" \
	-e "s|@PACKAGE_RPM_VERSION@|$(PACKAGE_RPM_VERSION)|g" \
	-e "s|@PACKAGE_RPM_RELEASE@|$(PACKAGE_RPM_RELEASE)|g" \
	-e "s|@PLUGIN_NAME@|$(PLUGIN_NAME)|g" \
	$< > $@

all:	all-local

clean:	clean-local
	-rm gluster-nagios-monitoring.spec

install:	all install-local
	install -d -m 0755 "$(DESTDIR)$(PLUGIN_DIR)"
	cp gluster-nagios-monitoring.json "$(DESTDIR)$(PLUGIN_ROOT_DIR)"
	cp -R src/* "$(DESTDIR)$(PLUGIN_DIR)"
	chmod -R u=rwX,go=rX "$(DESTDIR)$(PLUGIN_DIR)"

dist:	gluster-nagios-monitoring.spec
	git ls-files | \
		tar \
			--files-from /proc/self/fd/0 \
			--xform 's|^|$(PACKAGE_NAME)-$(PACKAGE_VERSION)/|' \
			--xform 's|gluster-nagios-monitoring.spec|$(PACKAGE_NAME).spec|' \
			-czf "$(TARBALL)" \
			gluster-nagios-monitoring.spec

gluster-nagios-monitoring.spec.in:	\
		Makefile \
		$(NULL)
	touch gluster-nagios-monitoring.spec.in

Makefile:	\
		version.mak \
		$(NULL)
	touch Makefile

# Custom rules
all-local:

clean-local:

install-local:
